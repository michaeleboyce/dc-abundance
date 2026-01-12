"use server";

import { db } from "@/lib/db";
import { newsletterSubscribers, RESIDENCE_OPTIONS, INTEREST_OPTIONS, HELP_OPTIONS } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { verifyTurnstile } from "@/lib/turnstile";

// Basic newsletter schema (for simple signups)
const newsletterSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  firstName: z.string().min(1, "First name is required").optional().or(z.literal("")),
  lastName: z.string().optional().or(z.literal("")),
  zipCode: z
    .string()
    .regex(/^\d{5}(-\d{4})?$/, "Please enter a valid ZIP code")
    .optional()
    .or(z.literal("")),
  turnstileToken: z.string().optional(),
});

// Enhanced newsletter schema (for full profile signup)
const enhancedNewsletterSchema = newsletterSchema.extend({
  residence: z.string().optional().or(z.literal("")),
  interests: z.array(z.string()).optional().default([]),
  otherInterest: z.string().optional().or(z.literal("")),
  helpPreferences: z.array(z.string()).optional().default([]),
  otherHelp: z.string().optional().or(z.literal("")),
  source: z.string().optional().default("website"),
});

export type NewsletterFormState = {
  success: boolean;
  message: string;
  errors?: {
    email?: string[];
    firstName?: string[];
    lastName?: string[];
    zipCode?: string[];
  };
};

export async function subscribeToNewsletter(
  prevState: NewsletterFormState,
  formData: FormData
): Promise<NewsletterFormState> {
  // Extract and validate form data with Zod
  const rawData = {
    email: formData.get("email"),
    firstName: formData.get("firstName") || "",
    lastName: formData.get("lastName") || "",
    zipCode: formData.get("zipCode") || "",
    turnstileToken: formData.get("turnstileToken") || "",
  };

  const validatedFields = newsletterSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      success: false,
      message: "Please fix the errors below.",
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { email, firstName, lastName, zipCode, turnstileToken } = validatedFields.data;

  // Verify Turnstile token (required when secret is configured)
  const turnstileConfigured = !!process.env.TURNSTILE_SECRET_KEY;
  if (turnstileConfigured) {
    if (!turnstileToken) {
      return {
        success: false,
        message: "Verification required. Please complete the security check.",
      };
    }
    const isHuman = await verifyTurnstile(turnstileToken);
    if (!isHuman) {
      return {
        success: false,
        message: "Verification failed. Please try again.",
      };
    }
  }

  try {
    // Normalize email to lowercase
    const normalizedEmail = email.toLowerCase().trim();

    // Check if already subscribed (using parameterized query via Drizzle)
    const existing = await db
      .select()
      .from(newsletterSubscribers)
      .where(eq(newsletterSubscribers.email, normalizedEmail))
      .limit(1);

    if (existing.length > 0) {
      // Reactivate if previously unsubscribed
      if (!existing[0].isActive) {
        await db
          .update(newsletterSubscribers)
          .set({
            isActive: true,
            unsubscribedAt: null,
            firstName: firstName || existing[0].firstName,
            lastName: lastName || existing[0].lastName,
            zipCode: zipCode || existing[0].zipCode,
          })
          .where(eq(newsletterSubscribers.email, normalizedEmail));

        return {
          success: true,
          message: "Welcome back! You've been re-subscribed to our newsletter.",
        };
      }

      return {
        success: true,
        message: "You're already subscribed! Thanks for your interest.",
      };
    }

    // Insert new subscriber (Drizzle uses parameterized queries - safe from SQL injection)
    await db.insert(newsletterSubscribers).values({
      email: normalizedEmail,
      firstName: firstName || null,
      lastName: lastName || null,
      zipCode: zipCode || null,
    });

    return {
      success: true,
      message: "Thanks for subscribing! You'll hear from us soon.",
    };
  } catch (error) {
    console.error("Newsletter subscription error:", error);
    return {
      success: false,
      message: "Something went wrong. Please try again later.",
    };
  }
}

// Enhanced subscription with full profile (for detailed signup form)
export async function subscribeWithProfile(
  prevState: NewsletterFormState,
  formData: FormData
): Promise<NewsletterFormState> {
  // Extract form data
  const rawData = {
    email: formData.get("email"),
    firstName: formData.get("firstName") || "",
    lastName: formData.get("lastName") || "",
    zipCode: formData.get("zipCode") || "",
    turnstileToken: formData.get("turnstileToken") || "",
    residence: formData.get("residence") || "",
    interests: formData.getAll("interests") as string[],
    otherInterest: formData.get("otherInterest") || "",
    helpPreferences: formData.getAll("helpPreferences") as string[],
    otherHelp: formData.get("otherHelp") || "",
    source: formData.get("source") || "website",
  };

  const validatedFields = enhancedNewsletterSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      success: false,
      message: "Please fix the errors below.",
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const {
    email, firstName, lastName, zipCode, turnstileToken,
    residence, interests, otherInterest, helpPreferences, otherHelp, source
  } = validatedFields.data;

  // Verify Turnstile token (required when secret is configured)
  const turnstileConfigured = !!process.env.TURNSTILE_SECRET_KEY;
  if (turnstileConfigured) {
    if (!turnstileToken) {
      return {
        success: false,
        message: "Verification required. Please complete the security check.",
      };
    }
    const isHuman = await verifyTurnstile(turnstileToken);
    if (!isHuman) {
      return {
        success: false,
        message: "Verification failed. Please try again.",
      };
    }
  }

  try {
    const normalizedEmail = email.toLowerCase().trim();

    // Check if already subscribed
    const existing = await db
      .select()
      .from(newsletterSubscribers)
      .where(eq(newsletterSubscribers.email, normalizedEmail))
      .limit(1);

    if (existing.length > 0) {
      // Update existing subscriber with new profile info
      await db
        .update(newsletterSubscribers)
        .set({
          isActive: true,
          unsubscribedAt: null,
          firstName: firstName || existing[0].firstName,
          lastName: lastName || existing[0].lastName,
          zipCode: zipCode || existing[0].zipCode,
          residence: residence || existing[0].residence,
          interests: interests.length > 0 ? interests : existing[0].interests,
          otherInterest: otherInterest || existing[0].otherInterest,
          helpPreferences: helpPreferences.length > 0 ? helpPreferences : existing[0].helpPreferences,
          otherHelp: otherHelp || existing[0].otherHelp,
        })
        .where(eq(newsletterSubscribers.email, normalizedEmail));

      return {
        success: true,
        message: existing[0].isActive
          ? "Thanks! Your profile has been updated."
          : "Welcome back! You've been re-subscribed.",
      };
    }

    // Insert new subscriber with full profile
    await db.insert(newsletterSubscribers).values({
      email: normalizedEmail,
      firstName: firstName || null,
      lastName: lastName || null,
      zipCode: zipCode || null,
      residence: residence || null,
      interests: interests,
      otherInterest: otherInterest || null,
      helpPreferences: helpPreferences,
      otherHelp: otherHelp || null,
      source: source,
    });

    return {
      success: true,
      message: "Thanks for joining DC Abundance! You'll hear from us soon.",
    };
  } catch (error) {
    console.error("Newsletter subscription error:", error);
    return {
      success: false,
      message: "Something went wrong. Please try again later.",
    };
  }
}

// Quick subscribe from event registration (minimal friction)
export async function quickSubscribe(
  email: string,
  firstName: string,
  lastName: string | null,
  source: string = "event_registration"
): Promise<{ success: boolean; message: string }> {
  try {
    const normalizedEmail = email.toLowerCase().trim();

    const existing = await db
      .select()
      .from(newsletterSubscribers)
      .where(eq(newsletterSubscribers.email, normalizedEmail))
      .limit(1);

    if (existing.length > 0) {
      if (!existing[0].isActive) {
        await db
          .update(newsletterSubscribers)
          .set({ isActive: true, unsubscribedAt: null })
          .where(eq(newsletterSubscribers.email, normalizedEmail));
      }
      return { success: true, message: "Already subscribed" };
    }

    await db.insert(newsletterSubscribers).values({
      email: normalizedEmail,
      firstName: firstName || null,
      lastName: lastName,
      source: source,
    });

    return { success: true, message: "Subscribed successfully" };
  } catch (error) {
    console.error("Quick subscribe error:", error);
    return { success: false, message: "Failed to subscribe" };
  }
}
