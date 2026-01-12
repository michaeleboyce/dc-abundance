"use server";

import { db } from "@/lib/db";
import { contactSubmissions } from "@/lib/db/schema";
import { z } from "zod";
import { verifyTurnstile } from "@/lib/turnstile";

// Zod schema for type-safe validation (prevents SQL injection)
const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  inquiryType: z.enum([
    "general",
    "housing",
    "transit",
    "energy",
    "government",
    "partnership",
    "media",
    "volunteer",
  ]),
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  message: z.string().min(20, "Message must be at least 20 characters"),
  turnstileToken: z.string().optional(),
});

export type ContactFormState = {
  success: boolean;
  message: string;
  errors?: {
    name?: string[];
    email?: string[];
    inquiryType?: string[];
    subject?: string[];
    message?: string[];
  };
};

export async function submitContactForm(
  prevState: ContactFormState,
  formData: FormData
): Promise<ContactFormState> {
  // Extract and validate form data with Zod
  const rawData = {
    name: formData.get("name"),
    email: formData.get("email"),
    inquiryType: formData.get("inquiryType"),
    subject: formData.get("subject"),
    message: formData.get("message"),
    turnstileToken: formData.get("turnstileToken") || "",
  };

  const validatedFields = contactSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      success: false,
      message: "Please fix the errors below.",
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { turnstileToken, ...formFields } = validatedFields.data;

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
    // Insert submission (Drizzle uses parameterized queries - safe from SQL injection)
    await db.insert(contactSubmissions).values(formFields);

    return {
      success: true,
      message: "Thanks for reaching out! We'll get back to you soon.",
    };
  } catch (error) {
    console.error("Contact form submission error:", error);
    return {
      success: false,
      message: "Something went wrong. Please try again later.",
    };
  }
}
