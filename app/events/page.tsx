import type { Metadata } from 'next';
import { Container } from '@/components/ui/Container';
import { EventCard } from '@/components/events/EventCard';
import { getUpcomingEvents } from '@/lib/actions/events';
import { db } from '@/lib/db';
import { eventRegistrations } from '@/lib/db/schema';
import { eq, count, and } from 'drizzle-orm';

export const metadata: Metadata = {
  title: 'Events | DC Abundance',
  description: 'Join DC Abundance events and connect with others building a more abundant DC.',
  openGraph: {
    title: 'Events | DC Abundance',
    description: 'Join DC Abundance events and connect with others building a more abundant DC.',
  },
};

export const revalidate = 60; // Revalidate every 60 seconds

async function getEventsWithCounts() {
  const events = await getUpcomingEvents();

  // Get confirmed counts for each event
  const eventsWithCounts = await Promise.all(
    events.map(async (event) => {
      const [result] = await db
        .select({ count: count() })
        .from(eventRegistrations)
        .where(
          and(
            eq(eventRegistrations.eventId, event.id),
            eq(eventRegistrations.status, 'confirmed')
          )
        );
      return {
        event,
        confirmedCount: result?.count || 0,
      };
    })
  );

  return eventsWithCounts;
}

export default async function EventsPage() {
  const eventsWithCounts = await getEventsWithCounts();

  return (
    <>
      <section className="py-16 lg:py-24 bg-primary-900">
        <Container>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-white">
            Upcoming Events
          </h1>
          <p className="mt-6 text-xl text-neutral-200 max-w-2xl">
            Join us at our next meetup or event. Connect with others who share your vision
            for a more abundant DC.
          </p>
        </Container>
      </section>

      <section className="py-16 lg:py-24">
        <Container>
          {eventsWithCounts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-neutral-600 text-lg">
                No upcoming events at the moment.
              </p>
              <p className="text-neutral-500 mt-2">
                Check back soon or subscribe to our newsletter to be notified.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {eventsWithCounts.map(({ event, confirmedCount }) => (
                <EventCard
                  key={event.id}
                  event={event}
                  confirmedCount={confirmedCount}
                />
              ))}
            </div>
          )}
        </Container>
      </section>
    </>
  );
}
