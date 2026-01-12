"use server";

import { db } from "@/lib/db";
import { events, eventRegistrations, seriesRegistrations } from "@/lib/db/schema";
import { eq, and, gt, asc, count, max } from "drizzle-orm";
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

// Get event by slug with registration counts and series info
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

  // Get series event count if part of a series
  let seriesEventCount = 0;
  if (event.seriesId) {
    const [seriesCount] = await db
      .select({ count: count() })
      .from(events)
      .where(
        and(
          eq(events.seriesId, event.seriesId),
          gt(events.eventDate, new Date())
        )
      );
    seriesEventCount = seriesCount?.count || 0;
  }

  return {
    ...event,
    confirmedCount: confirmedCount?.count || 0,
    spotsRemaining: event.maxAttendees - (confirmedCount?.count || 0),
    seriesEventCount,
  };
}

// Registration schema
const registrationSchema = z.object({
  eventId: z.coerce.number(),
  email: z.string().email("Please enter a valid email address"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().optional().or(z.literal("")),
  turnstileToken: z.string().optional(),
  seriesId: z.string().uuid().optional().or(z.literal("")),
  registerForSeries: z.enum(["true", "false"]).optional(),
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
    seriesId: formData.get("seriesId") || "",
    registerForSeries: formData.get("registerForSeries") || "false",
  };

  const validatedFields = registrationSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      success: false,
      message: "Please fix the errors below.",
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { eventId, email, firstName, lastName, turnstileToken, seriesId, registerForSeries } = validatedFields.data;
  const normalizedEmail = email.toLowerCase().trim();
  const shouldRegisterForSeries = registerForSeries === "true" && seriesId;

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
    // Handle series registration
    if (shouldRegisterForSeries) {
      return await registerForSeriesEvents(seriesId, normalizedEmail, firstName, lastName || null);
    }

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

    // Validate event is open for registration
    if (event.status !== 'published') {
      return {
        success: false,
        message: "Registration is not open for this event.",
      };
    }

    if (new Date(event.eventDate) < new Date()) {
      return {
        success: false,
        message: "This event has already occurred.",
      };
    }

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

// Helper function to register for all events in a series
async function registerForSeriesEvents(
  seriesId: string,
  email: string,
  firstName: string,
  lastName: string | null
): Promise<RegistrationFormState> {
  // Check if already registered for series
  const existingSeriesReg = await db
    .select()
    .from(seriesRegistrations)
    .where(
      and(
        eq(seriesRegistrations.seriesId, seriesId),
        eq(seriesRegistrations.email, email)
      )
    )
    .limit(1);

  if (existingSeriesReg[0] && !existingSeriesReg[0].cancelledAt) {
    return {
      success: true,
      message: "You're already registered for this event series!",
      status: 'confirmed',
    };
  }

  // Get all upcoming published events in the series
  const seriesEvents = await db
    .select()
    .from(events)
    .where(
      and(
        eq(events.seriesId, seriesId),
        eq(events.status, 'published'),
        gt(events.eventDate, new Date())
      )
    )
    .orderBy(asc(events.eventDate));

  if (seriesEvents.length === 0) {
    return {
      success: false,
      message: "No upcoming events found in this series.",
    };
  }

  // Create or update series registration
  if (existingSeriesReg[0]?.cancelledAt) {
    await db
      .update(seriesRegistrations)
      .set({
        firstName,
        lastName,
        registeredAt: new Date(),
        cancelledAt: null,
      })
      .where(eq(seriesRegistrations.id, existingSeriesReg[0].id));
  } else {
    await db.insert(seriesRegistrations).values({
      seriesId,
      email,
      firstName,
      lastName,
    });
  }

  // Register for each event in the series
  let confirmedCount = 0;
  let waitlistedCount = 0;

  for (const event of seriesEvents) {
    // Check if already registered for this specific event
    const existingReg = await db
      .select()
      .from(eventRegistrations)
      .where(
        and(
          eq(eventRegistrations.eventId, event.id),
          eq(eventRegistrations.email, email)
        )
      )
      .limit(1);

    if (existingReg[0] && existingReg[0].status !== 'cancelled') {
      if (existingReg[0].status === 'confirmed') confirmedCount++;
      else waitlistedCount++;
      continue;
    }

    // Get current confirmed count for this event
    const [currentConfirmed] = await db
      .select({ count: count() })
      .from(eventRegistrations)
      .where(
        and(
          eq(eventRegistrations.eventId, event.id),
          eq(eventRegistrations.status, 'confirmed')
        )
      );

    const eventIsFull = (currentConfirmed?.count || 0) >= event.maxAttendees;
    const status = eventIsFull ? 'waitlisted' : 'confirmed';

    let waitlistPosition: number | null = null;
    if (status === 'waitlisted') {
      const [maxPos] = await db
        .select({ maxPos: max(eventRegistrations.waitlistPosition) })
        .from(eventRegistrations)
        .where(
          and(
            eq(eventRegistrations.eventId, event.id),
            eq(eventRegistrations.status, 'waitlisted')
          )
        );
      waitlistPosition = (maxPos?.maxPos || 0) + 1;
    }

    if (existingReg[0]?.status === 'cancelled') {
      await db
        .update(eventRegistrations)
        .set({
          status,
          firstName,
          lastName,
          registeredAt: new Date(),
          cancelledAt: null,
          waitlistPosition,
        })
        .where(eq(eventRegistrations.id, existingReg[0].id));
    } else {
      await db.insert(eventRegistrations).values({
        eventId: event.id,
        email,
        firstName,
        lastName,
        status,
        waitlistPosition,
      });
    }

    if (status === 'confirmed') confirmedCount++;
    else waitlistedCount++;
  }

  // Send a single summary email for series registration
  const firstEvent = seriesEvents[0];
  try {
    const eventDate = firstEvent.eventDate.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });

    await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: `You're registered for ${seriesEvents.length} events: ${firstEvent.title}`,
      react: RegistrationConfirmationEmail({
        firstName,
        eventTitle: `${firstEvent.title} (and ${seriesEvents.length - 1} more)`,
        eventDate: `Starting ${eventDate}`,
        location: firstEvent.location,
        cancelUrl: `${SITE_URL}/events`, // Link to events page for series
      }),
    });
  } catch (emailError) {
    console.error('Failed to send series email:', emailError);
  }

  const message = waitlistedCount > 0
    ? `Registered for ${confirmedCount} events, waitlisted for ${waitlistedCount}. Check your email for details.`
    : `You're registered for all ${confirmedCount} events! Check your email for confirmation.`;

  return {
    success: true,
    message,
    status: waitlistedCount > 0 ? 'waitlisted' : 'confirmed',
  };
}
