"use server";

import { db } from "@/lib/db";
import { newsletterSubscribers } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { verifyTurnstile } from "@/lib/turnstile";

// Zod schema for type-safe validation (prevents SQL injection)
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

  // Verify Turnstile token (if configured)
  if (turnstileToken) {
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
