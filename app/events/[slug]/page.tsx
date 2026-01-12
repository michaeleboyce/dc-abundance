import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { EventRegistrationForm } from '@/components/events/EventRegistrationForm';
import { getEventBySlug } from '@/lib/actions/events';
import { Calendar, MapPin, Users, ArrowLeft } from 'lucide-react';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const event = await getEventBySlug(slug);

  if (!event) {
    return { title: 'Event Not Found | DC Abundance' };
  }

  return {
    title: `${event.title} | DC Abundance`,
    description: event.shortDescription || event.description,
    openGraph: {
      title: event.title,
      description: event.shortDescription || event.description,
    },
  };
}

export const revalidate = 30; // Revalidate every 30 seconds

export default async function EventPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const event = await getEventBySlug(slug);

  if (!event || event.status !== 'published') {
    notFound();
  }

  const isFull = event.spotsRemaining <= 0;
  const isPast = event.eventDate < new Date();

  const formattedDate = event.eventDate.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const formattedTime = event.eventDate.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });

  return (
    <>
      <section className="py-16 lg:py-24 bg-primary-900">
        <Container>
          <Link
            href="/events"
            className="inline-flex items-center gap-2 text-primary-200 hover:text-white transition-colors mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Events
          </Link>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-white">
            {event.title}
          </h1>

          <div className="mt-6 flex flex-wrap gap-6 text-neutral-200">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              <span>{formattedDate} at {formattedTime}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              <span>{event.location}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              {isPast ? (
                <span>{event.confirmedCount} attended</span>
              ) : isFull ? (
                <span className="text-amber-300">Event full - Waitlist available</span>
              ) : (
                <span>{event.spotsRemaining} of {event.maxAttendees} spots remaining</span>
              )}
            </div>
          </div>
        </Container>
      </section>

      <section className="py-16 lg:py-24">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <div className="prose prose-lg max-w-none">
                <h2 className="text-2xl font-display font-semibold text-neutral-800 mb-4">
                  About This Event
                </h2>
                <div className="text-neutral-600 whitespace-pre-wrap">
                  {event.description}
                </div>
              </div>

              {event.locationAddress && (
                <div className="mt-8">
                  <h3 className="text-lg font-semibold text-neutral-800 mb-2">
                    Location Details
                  </h3>
                  <p className="text-neutral-600">{event.locationAddress}</p>
                </div>
              )}
            </div>

            <div className="lg:col-span-1">
              <div className="sticky top-24 bg-white rounded-xl border border-neutral-200 p-6">
                <h3 className="text-lg font-semibold text-neutral-800 mb-4">
                  {isPast ? 'This event has ended' : 'Register'}
                </h3>

                {isPast ? (
                  <p className="text-neutral-600">
                    This event took place on {formattedDate}. Check out our upcoming events!
                  </p>
                ) : (
                  <EventRegistrationForm
                    eventId={event.id}
                    isFull={isFull}
                  />
                )}
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
