import type { Metadata } from 'next';
import Image from 'next/image';
import { Container } from '@/components/ui/Container';
import { EventCard } from '@/components/events/EventCard';
import { imagePlaceholders } from '@/lib/image-placeholders';
import { getUpcomingEvents } from '@/lib/actions/events';
import { db } from '@/lib/db';
import { eventRegistrations } from '@/lib/db/schema';
import { eq, count, and, inArray } from 'drizzle-orm';

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

  if (events.length === 0) {
    return [];
  }

  // Get confirmed counts in a single grouped query (avoids N+1)
  const eventIds = events.map(e => e.id);
  const confirmedCounts = await db
    .select({
      eventId: eventRegistrations.eventId,
      count: count(),
    })
    .from(eventRegistrations)
    .where(
      and(
        inArray(eventRegistrations.eventId, eventIds),
        eq(eventRegistrations.status, 'confirmed')
      )
    )
    .groupBy(eventRegistrations.eventId);

  // Build a lookup map
  const countMap = new Map<number, number>();
  for (const row of confirmedCounts) {
    countMap.set(row.eventId, row.count);
  }

  return events.map(event => ({
    event,
    confirmedCount: countMap.get(event.id) || 0,
  }));
}

export default async function EventsPage() {
  const eventsWithCounts = await getEventsWithCounts();

  return (
    <>
      <section className="relative h-[50vh] min-h-[400px] flex items-end">
        <Image
          src="/images/fourth-of-july-fireworks.jpg"
          alt="Fourth of July fireworks over the Washington Monument"
          fill
          priority
          className="object-cover"
          placeholder="blur"
          blurDataURL={imagePlaceholders.fourthOfJulyFireworks}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
        <Container className="relative z-10 pb-12">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white">
            Upcoming Events
          </h1>
          <p className="mt-4 text-xl text-neutral-200 max-w-2xl">
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
