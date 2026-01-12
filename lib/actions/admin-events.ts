"use server";

import { db } from "@/lib/db";
import { events, eventRegistrations } from "@/lib/db/schema";
import { eq, asc, and, count } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { resend, FROM_EMAIL, SITE_URL } from "@/lib/email";
import { WaitlistPromotedEmail } from "@/lib/email/templates/waitlist-promoted";

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

  // Get registration counts for each event
  const eventsWithCounts = await Promise.all(
    allEvents.map(async (event) => {
      const [confirmedCount] = await db
        .select({ count: count() })
        .from(eventRegistrations)
        .where(
          and(
            eq(eventRegistrations.eventId, event.id),
            eq(eventRegistrations.status, 'confirmed')
          )
        );

      const [waitlistCount] = await db
        .select({ count: count() })
        .from(eventRegistrations)
        .where(
          and(
            eq(eventRegistrations.eventId, event.id),
            eq(eventRegistrations.status, 'waitlisted')
          )
        );

      return {
        ...event,
        confirmedCount: confirmedCount?.count || 0,
        waitlistCount: waitlistCount?.count || 0,
      };
    })
  );

  return eventsWithCounts;
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

export async function deleteEvent(id: number): Promise<void> {
  await db.delete(events).where(eq(events.id, id));
  revalidatePath('/admin/events');
  revalidatePath('/events');
}

// Cancel a registration and promote from waitlist
export async function cancelRegistration(registrationId: number): Promise<void> {
  const [registration] = await db
    .select()
    .from(eventRegistrations)
    .where(eq(eventRegistrations.id, registrationId))
    .limit(1);

  if (!registration) return;

  // Mark as cancelled
  await db
    .update(eventRegistrations)
    .set({
      status: 'cancelled',
      cancelledAt: new Date(),
    })
    .where(eq(eventRegistrations.id, registrationId));

  // If was confirmed, promote first waitlisted person
  if (registration.status === 'confirmed') {
    const [nextInLine] = await db
      .select()
      .from(eventRegistrations)
      .where(
        and(
          eq(eventRegistrations.eventId, registration.eventId),
          eq(eventRegistrations.status, 'waitlisted')
        )
      )
      .orderBy(asc(eventRegistrations.waitlistPosition))
      .limit(1);

    if (nextInLine) {
      await db
        .update(eventRegistrations)
        .set({
          status: 'confirmed',
          waitlistPosition: null,
        })
        .where(eq(eventRegistrations.id, nextInLine.id));

      // Get event details for email
      const [event] = await db
        .select()
        .from(events)
        .where(eq(events.id, registration.eventId))
        .limit(1);

      if (event) {
        // Send promotion email
        const eventDate = event.eventDate.toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: 'numeric',
          minute: '2-digit',
        });

        const cancelUrl = `${SITE_URL}/api/cancel-registration?token=${nextInLine.confirmationToken}`;

        try {
          await resend.emails.send({
            from: FROM_EMAIL,
            to: nextInLine.email,
            subject: `A spot opened up: ${event.title}`,
            react: WaitlistPromotedEmail({
              firstName: nextInLine.firstName,
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
    }
  }

  revalidatePath('/admin/events');
}
