import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getEventById } from '@/lib/actions/admin-events';
import { EventForm } from '@/components/admin/EventForm';
import { ArrowLeft } from 'lucide-react';

export default async function EditEventPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const eventId = parseInt(id, 10);

  if (isNaN(eventId)) {
    notFound();
  }

  const event = await getEventById(eventId);

  if (!event) {
    notFound();
  }

  return (
    <div>
      <Link
        href="/admin/events"
        className="inline-flex items-center gap-2 text-neutral-600 hover:text-neutral-800 mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Events
      </Link>

      <h1 className="text-2xl font-display font-bold text-neutral-800 mb-8">
        Edit Event
      </h1>

      <div className="bg-white rounded-xl border border-neutral-200 p-6">
        <EventForm event={event} />
      </div>
    </div>
  );
}
