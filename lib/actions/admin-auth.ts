"use server";

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { z } from 'zod';

const loginSchema = z.object({
  password: z.string().min(1, "Password is required"),
});

export type LoginFormState = {
  success: boolean;
  message: string;
  errors?: {
    password?: string[];
  };
};

export async function adminLogin(
  prevState: LoginFormState,
  formData: FormData
): Promise<LoginFormState> {
  const rawData = {
    password: formData.get("password"),
  };

  const validatedFields = loginSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      success: false,
      message: "Please enter a password.",
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { password } = validatedFields.data;

  if (password === process.env.ADMIN_PASSWORD) {
    const cookieStore = await cookies();

    // Create a simple hash for the cookie value (not the raw password)
    const authValue = Buffer.from(`admin:${Date.now()}`).toString('base64');

    cookieStore.set('admin_auth', authValue, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24, // 24 hours
      path: '/',
    });

    redirect('/admin');
  }

  return {
    success: false,
    message: "Invalid password.",
  };
}

export async function adminLogout(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete('admin_auth');
  redirect('/admin/login');
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const authCookie = cookieStore.get('admin_auth');
  return !!authCookie?.value;
}
