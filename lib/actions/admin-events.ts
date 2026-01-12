"use server";

import { db } from "@/lib/db";
import { events, eventRegistrations, eventSeries } from "@/lib/db/schema";
import { eq, asc, and, count, inArray, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { resend, FROM_EMAIL, SITE_URL } from "@/lib/email";
import { WaitlistPromotedEmail } from "@/lib/email/templates/waitlist-promoted";
import {
  generateWeeklyDates,
  generateMonthlyDates,
  generateDateSlugSuffix,
  type DayOfWeek,
  type WeekOfMonth,
} from "@/lib/recurrence";

// Get event by ID (for editing)
export async function getEventById(id: number) {
  const result = await db
    .select()
    .from(events)
    .where(eq(events.id, id))
    .limit(1);

  return result[0] || null;
}

// Get all events for admin
export async function getAdminEvents() {
  const allEvents = await db
    .select()
    .from(events)
    .orderBy(asc(events.eventDate));

  if (allEvents.length === 0) {
    return [];
  }

  // Get registration counts in a single grouped query (avoids N+1)
  const eventIds = allEvents.map(e => e.id);
  const registrationCounts = await db
    .select({
      eventId: eventRegistrations.eventId,
      status: eventRegistrations.status,
      count: count(),
    })
    .from(eventRegistrations)
    .where(inArray(eventRegistrations.eventId, eventIds))
    .groupBy(eventRegistrations.eventId, eventRegistrations.status);

  // Build a lookup map for counts
  const countMap = new Map<number, { confirmed: number; waitlisted: number }>();
  for (const row of registrationCounts) {
    if (!countMap.has(row.eventId)) {
      countMap.set(row.eventId, { confirmed: 0, waitlisted: 0 });
    }
    const entry = countMap.get(row.eventId)!;
    if (row.status === 'confirmed') {
      entry.confirmed = row.count;
    } else if (row.status === 'waitlisted') {
      entry.waitlisted = row.count;
    }
  }

  // Map events with their counts
  return allEvents.map(event => ({
    ...event,
    confirmedCount: countMap.get(event.id)?.confirmed || 0,
    waitlistCount: countMap.get(event.id)?.waitlisted || 0,
  }));
}

// Get registrations for an event
export async function getEventRegistrations(eventId: number) {
  return db
    .select()
    .from(eventRegistrations)
    .where(eq(eventRegistrations.eventId, eventId))
    .orderBy(asc(eventRegistrations.registeredAt));
}

// Event form schema
const eventSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  slug: z.string().min(3, "Slug must be at least 3 characters")
    .regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and hyphens"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  shortDescription: z.string().optional().or(z.literal("")),
  eventDate: z.string().min(1, "Event date is required"),
  location: z.string().min(3, "Location must be at least 3 characters"),
  locationAddress: z.string().optional().or(z.literal("")),
  maxAttendees: z.coerce.number().min(1, "Must have at least 1 attendee"),
  status: z.enum(['draft', 'published', 'cancelled']),
  ownerEmail: z.string().email("Please enter a valid email address"),
  showOwnerEmail: z.boolean().optional().default(false),
});

// Recurring event schema with conditional validation for monthly recurrence
const recurringEventSchema = eventSchema.omit({ slug: true }).extend({
  recurrenceType: z.enum(['weekly', 'monthly']),
  intervalWeeks: z.coerce.number().min(1).max(12).optional(),
  dayOfWeek: z.coerce.number().min(0).max(6).optional(),
  weekOfMonth: z.coerce.number().min(1).max(5).optional(),
  occurrences: z.coerce.number().min(2).max(104),
}).superRefine((data, ctx) => {
  if (data.recurrenceType === 'monthly') {
    if (data.dayOfWeek === undefined) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Day of week is required for monthly recurrence',
        path: ['dayOfWeek'],
      });
    }
    if (data.weekOfMonth === undefined) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Week of month is required for monthly recurrence',
        path: ['weekOfMonth'],
      });
    }
  }
});

export type EventFormState = {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
};

export async function createEvent(
  prevState: EventFormState,
  formData: FormData
): Promise<EventFormState> {
  const rawData = {
    title: formData.get("title"),
    slug: formData.get("slug"),
    description: formData.get("description"),
    shortDescription: formData.get("shortDescription") || "",
    eventDate: formData.get("eventDate"),
    location: formData.get("location"),
    locationAddress: formData.get("locationAddress") || "",
    maxAttendees: formData.get("maxAttendees"),
    status: formData.get("status"),
    ownerEmail: formData.get("ownerEmail"),
    showOwnerEmail: formData.get("showOwnerEmail") === "on",
  };

  const validatedFields = eventSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      success: false,
      message: "Please fix the errors below.",
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const data = validatedFields.data;

  try {
    // Check for duplicate slug
    const existing = await db
      .select()
      .from(events)
      .where(eq(events.slug, data.slug))
      .limit(1);

    if (existing.length > 0) {
      return {
        success: false,
        message: "An event with this slug already exists.",
        errors: { slug: ["This slug is already in use"] },
      };
    }

    await db.insert(events).values({
      title: data.title,
      slug: data.slug,
      description: data.description,
      shortDescription: data.shortDescription || null,
      eventDate: new Date(data.eventDate),
      location: data.location,
      locationAddress: data.locationAddress || null,
      maxAttendees: data.maxAttendees,
      status: data.status,
      ownerEmail: data.ownerEmail,
      showOwnerEmail: data.showOwnerEmail ?? false,
    });

    revalidatePath('/admin/events');
    revalidatePath('/events');
  } catch (error) {
    console.error("Create event error:", error);
    return {
      success: false,
      message: "Something went wrong. Please try again.",
    };
  }

  redirect('/admin/events');
}

export async function updateEvent(
  id: number,
  prevState: EventFormState,
  formData: FormData
): Promise<EventFormState> {
  const rawData = {
    title: formData.get("title"),
    slug: formData.get("slug"),
    description: formData.get("description"),
    shortDescription: formData.get("shortDescription") || "",
    eventDate: formData.get("eventDate"),
    location: formData.get("location"),
    locationAddress: formData.get("locationAddress") || "",
    maxAttendees: formData.get("maxAttendees"),
    status: formData.get("status"),
    ownerEmail: formData.get("ownerEmail"),
    showOwnerEmail: formData.get("showOwnerEmail") === "on",
  };

  const validatedFields = eventSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      success: false,
      message: "Please fix the errors below.",
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const data = validatedFields.data;

  try {
    // Check for duplicate slug (excluding current event)
    const existing = await db
      .select()
      .from(events)
      .where(eq(events.slug, data.slug))
      .limit(1);

    if (existing.length > 0 && existing[0].id !== id) {
      return {
        success: false,
        message: "An event with this slug already exists.",
        errors: { slug: ["This slug is already in use"] },
      };
    }

    await db
      .update(events)
      .set({
        title: data.title,
        slug: data.slug,
        description: data.description,
        shortDescription: data.shortDescription || null,
        eventDate: new Date(data.eventDate),
        location: data.location,
        locationAddress: data.locationAddress || null,
        maxAttendees: data.maxAttendees,
        status: data.status,
        ownerEmail: data.ownerEmail,
        showOwnerEmail: data.showOwnerEmail ?? false,
        updatedAt: new Date(),
      })
      .where(eq(events.id, id));

    revalidatePath('/admin/events');
    revalidatePath('/events');
    revalidatePath(`/events/${data.slug}`);
  } catch (error) {
    console.error("Update event error:", error);
    return {
      success: false,
      message: "Something went wrong. Please try again.",
    };
  }

  redirect('/admin/events');
}

// Helper to generate a slug from title and date
function generateSlug(title: string, date: Date): string {
  const baseSlug = title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
  const dateSuffix = generateDateSlugSuffix(date);
  return `${baseSlug}-${dateSuffix}`;
}

export async function createRecurringEvent(
  prevState: EventFormState,
  formData: FormData
): Promise<EventFormState> {
  const rawData = {
    title: formData.get("title"),
    description: formData.get("description"),
    shortDescription: formData.get("shortDescription") || "",
    eventDate: formData.get("eventDate"),
    location: formData.get("location"),
    locationAddress: formData.get("locationAddress") || "",
    maxAttendees: formData.get("maxAttendees"),
    status: formData.get("status"),
    ownerEmail: formData.get("ownerEmail"),
    showOwnerEmail: formData.get("showOwnerEmail") === "on",
    recurrenceType: formData.get("recurrenceType"),
    intervalWeeks: formData.get("intervalWeeks") || "1",
    dayOfWeek: formData.get("dayOfWeek") || "0",
    weekOfMonth: formData.get("weekOfMonth") || "1",
    occurrences: formData.get("occurrences"),
  };

  const validatedFields = recurringEventSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      success: false,
      message: "Please fix the errors below.",
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const data = validatedFields.data;

  try {
    // Generate dates based on recurrence pattern
    const startDate = new Date(data.eventDate);
    let eventDates: Date[];

    if (data.recurrenceType === 'weekly') {
      eventDates = generateWeeklyDates(
        startDate,
        data.intervalWeeks || 1,
        data.occurrences
      );
    } else {
      eventDates = generateMonthlyDates(
        startDate,
        (data.dayOfWeek || startDate.getDay()) as DayOfWeek,
        (data.weekOfMonth || 1) as WeekOfMonth,
        data.occurrences
      );
    }

    // Create series record
    const [series] = await db.insert(eventSeries).values({
      title: data.title,
    }).returning();

    // Create individual events
    const eventValues = eventDates.map((date) => ({
      title: data.title,
      slug: generateSlug(data.title, date),
      description: data.description,
      shortDescription: data.shortDescription || null,
      eventDate: date,
      location: data.location,
      locationAddress: data.locationAddress || null,
      maxAttendees: data.maxAttendees,
      status: data.status,
      ownerEmail: data.ownerEmail,
      showOwnerEmail: data.showOwnerEmail ?? false,
      seriesId: series.id,
      recurrenceType: data.recurrenceType,
    }));

    // Check for any duplicate slugs
    for (const eventValue of eventValues) {
      const existing = await db
        .select()
        .from(events)
        .where(eq(events.slug, eventValue.slug))
        .limit(1);

      if (existing.length > 0) {
        // Clean up the series we created
        await db.delete(eventSeries).where(eq(eventSeries.id, series.id));
        return {
          success: false,
          message: `A slug conflict exists: "${eventValue.slug}" is already in use.`,
          errors: { title: ["An event with a generated slug already exists"] },
        };
      }
    }

    // Insert all events
    await db.insert(events).values(eventValues);

    revalidatePath('/admin/events');
    revalidatePath('/events');
  } catch (error) {
    console.error("Create recurring event error:", error);
    return {
      success: false,
      message: "Something went wrong. Please try again.",
    };
  }

  redirect('/admin/events');
}

export async function deleteEvent(id: number): Promise<void> {
  await db.delete(events).where(eq(events.id, id));
  revalidatePath('/admin/events');
  revalidatePath('/events');
}

// Cancel a registration and promote from waitlist
export async function cancelRegistration(registrationId: number): Promise<void> {
  // Use transaction with row locking to prevent race conditions
  const result = await db.transaction(async (tx) => {
    // Lock the registration row to prevent concurrent modifications
    const registrationRows = await tx.execute(
      sql`SELECT * FROM event_registrations WHERE id = ${registrationId} FOR UPDATE`
    );
    const registration = registrationRows.rows[0] as {
      id: number;
      event_id: number;
      email: string;
      first_name: string;
      status: string;
    } | undefined;

    if (!registration) return null;

    // Mark as cancelled
    await tx
      .update(eventRegistrations)
      .set({
        status: 'cancelled',
        cancelledAt: new Date(),
      })
      .where(eq(eventRegistrations.id, registrationId));

    // If was confirmed, promote first waitlisted person
    if (registration.status === 'confirmed') {
      // Lock the event row to prevent concurrent promotions
      await tx.execute(sql`SELECT id FROM events WHERE id = ${registration.event_id} FOR UPDATE`);

      // Get first person on waitlist (with lock)
      const waitlistRows = await tx.execute(
        sql`SELECT * FROM event_registrations
            WHERE event_id = ${registration.event_id}
            AND status = 'waitlisted'
            ORDER BY waitlist_position ASC
            LIMIT 1
            FOR UPDATE`
      );
      const nextInLine = waitlistRows.rows[0] as {
        id: number;
        email: string;
        first_name: string;
        confirmation_token: string;
      } | undefined;

      if (nextInLine) {
        // Promote to confirmed
        await tx
          .update(eventRegistrations)
          .set({
            status: 'confirmed',
            waitlistPosition: null,
          })
          .where(eq(eventRegistrations.id, nextInLine.id));

        // Get event details for email (no lock needed, just reading)
        const [event] = await tx
          .select()
          .from(events)
          .where(eq(events.id, registration.event_id))
          .limit(1);

        return {
          promoted: nextInLine,
          event,
        };
      }
    }

    return null;
  });

  // Send email OUTSIDE transaction to avoid holding locks
  if (result?.promoted && result?.event) {
    const { promoted, event } = result;
    const eventDate = event.eventDate.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });

    const cancelUrl = `${SITE_URL}/api/cancel-registration?token=${promoted.confirmation_token}`;

    try {
      await resend.emails.send({
        from: FROM_EMAIL,
        to: promoted.email,
        subject: `A spot opened up: ${event.title}`,
        react: WaitlistPromotedEmail({
          firstName: promoted.first_name,
          eventTitle: event.title,
          eventDate,
          location: event.location,
          cancelUrl,
        }),
      });
    } catch (emailError) {
      console.error('Failed to send promotion email:', emailError);
    }
  }

  revalidatePath('/admin/events');
}
