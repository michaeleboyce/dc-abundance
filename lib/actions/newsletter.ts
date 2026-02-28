"use server";

import { db } from "@/lib/db";
import { newsletterSubscribers } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

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
