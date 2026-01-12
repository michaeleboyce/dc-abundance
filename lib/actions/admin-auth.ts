"use server";

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { verifyTurnstile } from '@/lib/turnstile';
import { createSessionToken, verifySessionToken } from '@/lib/auth-utils';

const loginSchema = z.object({
  password: z.string().min(1, "Password is required"),
  turnstileToken: z.string().optional(),
});

export type LoginFormState = {
  success: boolean;
  message: string;
  errors?: {
    password?: string[];
  };
};

// Simple in-memory rate limiting (in production, use Redis)
const loginAttempts = new Map<string, { count: number; lastAttempt: number }>();
const MAX_ATTEMPTS = 5;
const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes

function getClientIdentifier(): string {
  // In a real app, you'd get the IP from headers
  // For now, use a simple identifier
  return 'global';
}

function checkRateLimit(): { allowed: boolean; remainingTime?: number } {
  const identifier = getClientIdentifier();
  const now = Date.now();
  const attempts = loginAttempts.get(identifier);

  if (!attempts) {
    return { allowed: true };
  }

  // Reset if lockout period has passed
  if (now - attempts.lastAttempt > LOCKOUT_DURATION) {
    loginAttempts.delete(identifier);
    return { allowed: true };
  }

  if (attempts.count >= MAX_ATTEMPTS) {
    const remainingTime = Math.ceil((LOCKOUT_DURATION - (now - attempts.lastAttempt)) / 1000 / 60);
    return { allowed: false, remainingTime };
  }

  return { allowed: true };
}

function recordFailedAttempt(): void {
  const identifier = getClientIdentifier();
  const now = Date.now();
  const attempts = loginAttempts.get(identifier);

  if (!attempts) {
    loginAttempts.set(identifier, { count: 1, lastAttempt: now });
  } else {
    loginAttempts.set(identifier, { count: attempts.count + 1, lastAttempt: now });
  }
}

function clearAttempts(): void {
  const identifier = getClientIdentifier();
  loginAttempts.delete(identifier);
}

export async function adminLogin(
  prevState: LoginFormState,
  formData: FormData
): Promise<LoginFormState> {
  // Check rate limit first
  const rateLimitCheck = checkRateLimit();
  if (!rateLimitCheck.allowed) {
    return {
      success: false,
      message: `Too many login attempts. Please try again in ${rateLimitCheck.remainingTime} minutes.`,
    };
  }

  const rawData = {
    password: formData.get("password"),
    turnstileToken: formData.get("turnstileToken"),
  };

  const validatedFields = loginSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      success: false,
      message: "Please enter a password.",
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { password, turnstileToken } = validatedFields.data;

  // Verify Turnstile token (required when secret is configured)
  const turnstileConfigured = !!process.env.TURNSTILE_SECRET_KEY;
  if (turnstileConfigured) {
    if (!turnstileToken) {
      return {
        success: false,
        message: "Verification required. Please complete the security check.",
      };
    }
    const isValidCaptcha = await verifyTurnstile(turnstileToken);
    if (!isValidCaptcha) {
      return {
        success: false,
        message: "Captcha verification failed. Please try again.",
      };
    }
  }

  if (password === process.env.ADMIN_PASSWORD) {
    const cookieStore = await cookies();

    // Create cryptographically secure session token
    const authValue = createSessionToken();

    cookieStore.set('admin_auth', authValue, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict', // Stricter than 'lax' for admin
      maxAge: 60 * 60 * 24, // 24 hours
      path: '/',
    });

    // Clear failed attempts on successful login
    clearAttempts();

    redirect('/admin');
  }

  // Record failed attempt
  recordFailedAttempt();

  return {
    success: false,
    message: "Invalid password.",
  };
}

// verifySessionToken is used internally only

export async function adminLogout(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete('admin_auth');
  redirect('/admin/login');
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const authCookie = cookieStore.get('admin_auth');

  if (!authCookie?.value) {
    return false;
  }

  // Verify the session token is valid and not expired
  return verifySessionToken(authCookie.value);
}
