import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getEventById, getEventRegistrations, cancelRegistration } from '@/lib/actions/admin-events';
import { ArrowLeft, Mail, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export default async function EventRegistrationsPage({
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

  const registrations = await getEventRegistrations(eventId);

  // Separate by status
  const confirmed = registrations.filter(r => r.status === 'confirmed');
  const waitlisted = registrations.filter(r => r.status === 'waitlisted');
  const cancelled = registrations.filter(r => r.status === 'cancelled');

  return (
    <div>
      <Link
        href="/admin/events"
        className="inline-flex items-center gap-2 text-neutral-600 hover:text-neutral-800 mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Events
      </Link>

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-display font-bold text-neutral-800">
            Registrations
          </h1>
          <p className="text-neutral-600">{event.title}</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-neutral-800">
            {confirmed.length} / {event.maxAttendees}
          </p>
          <p className="text-sm text-neutral-600">confirmed</p>
        </div>
      </div>

      {registrations.length === 0 ? (
        <div className="bg-white rounded-xl border border-neutral-200 p-12 text-center">
          <Mail className="h-12 w-12 text-neutral-400 mx-auto mb-4" />
          <p className="text-neutral-600">No registrations yet.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Confirmed */}
          {confirmed.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-neutral-800 mb-4">
                Confirmed ({confirmed.length})
              </h2>
              <RegistrationTable registrations={confirmed} />
            </div>
          )}

          {/* Waitlist */}
          {waitlisted.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-amber-700 mb-4">
                Waitlist ({waitlisted.length})
              </h2>
              <RegistrationTable registrations={waitlisted} showWaitlistPosition />
            </div>
          )}

          {/* Cancelled */}
          {cancelled.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-neutral-500 mb-4">
                Cancelled ({cancelled.length})
              </h2>
              <RegistrationTable registrations={cancelled} isCancelled />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function RegistrationTable({
  registrations,
  showWaitlistPosition = false,
  isCancelled = false,
}: {
  registrations: Awaited<ReturnType<typeof getEventRegistrations>>;
  showWaitlistPosition?: boolean;
  isCancelled?: boolean;
}) {
  async function handleCancel(id: number) {
    'use server';
    await cancelRegistration(id);
  }

  return (
    <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
      <table className="w-full">
        <thead className="bg-neutral-50 border-b border-neutral-200">
          <tr>
            {showWaitlistPosition && (
              <th className="text-left px-6 py-3 text-sm font-semibold text-neutral-600">#</th>
            )}
            <th className="text-left px-6 py-3 text-sm font-semibold text-neutral-600">Name</th>
            <th className="text-left px-6 py-3 text-sm font-semibold text-neutral-600">Email</th>
            <th className="text-left px-6 py-3 text-sm font-semibold text-neutral-600">Registered</th>
            {!isCancelled && (
              <th className="text-right px-6 py-3 text-sm font-semibold text-neutral-600">Actions</th>
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-200">
          {registrations.map((reg) => (
            <tr key={reg.id} className={cn(isCancelled && 'opacity-50')}>
              {showWaitlistPosition && (
                <td className="px-6 py-4 text-sm text-neutral-600">
                  {reg.waitlistPosition}
                </td>
              )}
              <td className="px-6 py-4">
                <span className="font-medium text-neutral-800">
                  {reg.firstName} {reg.lastName}
                </span>
              </td>
              <td className="px-6 py-4 text-sm text-neutral-600">
                {reg.email}
              </td>
              <td className="px-6 py-4 text-sm text-neutral-600">
                {reg.registeredAt.toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  hour: 'numeric',
                  minute: '2-digit',
                })}
              </td>
              {!isCancelled && (
                <td className="px-6 py-4 text-right">
                  <form action={handleCancel.bind(null, reg.id)}>
                    <button
                      type="submit"
                      className="text-sm text-red-600 hover:text-red-700 font-medium inline-flex items-center gap-1"
                    >
                      <X className="h-3 w-3" />
                      Cancel
                    </button>
                  </form>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
