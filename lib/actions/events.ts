"use server";

import { db } from "@/lib/db";
import { events, eventRegistrations } from "@/lib/db/schema";
import { eq, and, gt, asc, count, sql, max } from "drizzle-orm";
import { verifyTurnstile } from "@/lib/turnstile";
import { resend, FROM_EMAIL, SITE_URL } from "@/lib/email";
import { RegistrationConfirmationEmail } from "@/lib/email/templates/registration-confirmation";
import { WaitlistConfirmationEmail } from "@/lib/email/templates/waitlist-confirmation";
import { z } from "zod";

// Get all published upcoming events
export async function getUpcomingEvents() {
  return db
    .select()
    .from(events)
    .where(
      and(
        eq(events.status, 'published'),
        gt(events.eventDate, new Date())
      )
    )
    .orderBy(asc(events.eventDate));
}

// Get all events (for admin)
export async function getAllEvents() {
  return db
    .select()
    .from(events)
    .orderBy(asc(events.eventDate));
}

// Get event by slug with registration counts
export async function getEventBySlug(slug: string) {
  const eventResult = await db
    .select()
    .from(events)
    .where(eq(events.slug, slug))
    .limit(1);

  if (!eventResult[0]) return null;

  const event = eventResult[0];

  const [confirmedCount] = await db
    .select({ count: count() })
    .from(eventRegistrations)
    .where(
      and(
        eq(eventRegistrations.eventId, event.id),
        eq(eventRegistrations.status, 'confirmed')
      )
    );

  return {
    ...event,
    confirmedCount: confirmedCount?.count || 0,
    spotsRemaining: event.maxAttendees - (confirmedCount?.count || 0),
  };
}

// Registration schema
const registrationSchema = z.object({
  eventId: z.coerce.number(),
  email: z.string().email("Please enter a valid email address"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().optional().or(z.literal("")),
  turnstileToken: z.string().optional(),
});

export type RegistrationFormState = {
  success: boolean;
  message: string;
  status?: 'confirmed' | 'waitlisted';
  errors?: {
    email?: string[];
    firstName?: string[];
    lastName?: string[];
  };
};

export async function registerForEvent(
  prevState: RegistrationFormState,
  formData: FormData
): Promise<RegistrationFormState> {
  const rawData = {
    eventId: formData.get("eventId"),
    email: formData.get("email"),
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName") || "",
    turnstileToken: formData.get("turnstileToken") || "",
  };

  const validatedFields = registrationSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      success: false,
      message: "Please fix the errors below.",
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { eventId, email, firstName, lastName, turnstileToken } = validatedFields.data;
  const normalizedEmail = email.toLowerCase().trim();

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
    // Get the event
    const eventResult = await db
      .select()
      .from(events)
      .where(eq(events.id, eventId))
      .limit(1);

    if (!eventResult[0]) {
      return {
        success: false,
        message: "Event not found.",
      };
    }

    const event = eventResult[0];

    // Check if already registered
    const existingRegistration = await db
      .select()
      .from(eventRegistrations)
      .where(
        and(
          eq(eventRegistrations.eventId, eventId),
          eq(eventRegistrations.email, normalizedEmail)
        )
      )
      .limit(1);

    if (existingRegistration[0]) {
      const existing = existingRegistration[0];
      if (existing.status === 'cancelled') {
        // Allow re-registration by updating the existing record
        // Will be handled below
      } else {
        return {
          success: true,
          message: existing.status === 'confirmed'
            ? "You're already registered for this event!"
            : "You're already on the waitlist for this event.",
          status: existing.status as 'confirmed' | 'waitlisted',
        };
      }
    }

    // Get current confirmed count
    const [confirmedCount] = await db
      .select({ count: count() })
      .from(eventRegistrations)
      .where(
        and(
          eq(eventRegistrations.eventId, eventId),
          eq(eventRegistrations.status, 'confirmed')
        )
      );

    const currentCount = confirmedCount?.count || 0;
    const isFull = currentCount >= event.maxAttendees;
    const status = isFull ? 'waitlisted' : 'confirmed';

    // Get waitlist position if needed
    let waitlistPosition: number | null = null;
    if (status === 'waitlisted') {
      const [maxPosition] = await db
        .select({ maxPos: max(eventRegistrations.waitlistPosition) })
        .from(eventRegistrations)
        .where(
          and(
            eq(eventRegistrations.eventId, eventId),
            eq(eventRegistrations.status, 'waitlisted')
          )
        );
      waitlistPosition = (maxPosition?.maxPos || 0) + 1;
    }

    // Insert or update registration
    let registration;
    if (existingRegistration[0]?.status === 'cancelled') {
      // Re-register by updating existing record
      const [updated] = await db
        .update(eventRegistrations)
        .set({
          status,
          firstName,
          lastName: lastName || null,
          registeredAt: new Date(),
          cancelledAt: null,
          waitlistPosition,
        })
        .where(eq(eventRegistrations.id, existingRegistration[0].id))
        .returning();
      registration = updated;
    } else {
      // Create new registration
      const [inserted] = await db
        .insert(eventRegistrations)
        .values({
          eventId,
          email: normalizedEmail,
          firstName,
          lastName: lastName || null,
          status,
          waitlistPosition,
        })
        .returning();
      registration = inserted;
    }

    // Format date for email
    const eventDate = event.eventDate.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });

    const cancelUrl = `${SITE_URL}/api/cancel-registration?token=${registration.confirmationToken}`;

    // Send confirmation email
    try {
      if (status === 'confirmed') {
        await resend.emails.send({
          from: FROM_EMAIL,
          to: normalizedEmail,
          subject: `You're registered: ${event.title}`,
          react: RegistrationConfirmationEmail({
            firstName,
            eventTitle: event.title,
            eventDate,
            location: event.location,
            cancelUrl,
          }),
        });
      } else {
        await resend.emails.send({
          from: FROM_EMAIL,
          to: normalizedEmail,
          subject: `You're on the waitlist: ${event.title}`,
          react: WaitlistConfirmationEmail({
            firstName,
            eventTitle: event.title,
            eventDate,
            waitlistPosition: waitlistPosition!,
            cancelUrl,
          }),
        });
      }
    } catch (emailError) {
      console.error('Failed to send email:', emailError);
      // Don't fail the registration if email fails
    }

    return {
      success: true,
      message: status === 'confirmed'
        ? "You're registered! Check your email for confirmation."
        : `You're #${waitlistPosition} on the waitlist. We'll email you if a spot opens up.`,
      status,
    };
  } catch (error) {
    console.error("Registration error:", error);
    return {
      success: false,
      message: "Something went wrong. Please try again later.",
    };
  }
}
