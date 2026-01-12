import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { events, eventRegistrations } from '@/lib/db/schema';
import { eq, and, asc } from 'drizzle-orm';
import { resend, FROM_EMAIL, SITE_URL } from '@/lib/email';
import { WaitlistPromotedEmail } from '@/lib/email/templates/waitlist-promoted';

// GET handler for one-click registration cancellation
export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('token');

  if (!token) {
    return NextResponse.redirect(new URL('/events?error=missing-token', request.url));
  }

  try {
    // Find the registration
    const [registration] = await db
      .select()
      .from(eventRegistrations)
      .where(eq(eventRegistrations.confirmationToken, token))
      .limit(1);

    if (!registration) {
      return NextResponse.redirect(new URL('/events?error=invalid-token', request.url));
    }

    if (registration.status === 'cancelled') {
      return NextResponse.redirect(new URL('/events?message=already-cancelled', request.url));
    }

    const wasConfirmed = registration.status === 'confirmed';

    // Mark as cancelled
    await db
      .update(eventRegistrations)
      .set({
        status: 'cancelled',
        cancelledAt: new Date(),
      })
      .where(eq(eventRegistrations.id, registration.id));

    // If was confirmed, promote first waitlisted person
    if (wasConfirmed) {
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

    return NextResponse.redirect(new URL('/events?message=cancelled', request.url));
  } catch (error) {
    console.error('Cancel registration error:', error);
    return NextResponse.redirect(new URL('/events?error=server-error', request.url));
  }
}
