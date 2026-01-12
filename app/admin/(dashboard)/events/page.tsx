import Link from 'next/link';
import { getAdminEvents } from '@/lib/actions/admin-events';
import { Plus, Calendar, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

export default async function AdminEventsPage() {
  const events = await getAdminEvents();

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-display font-bold text-neutral-800">
          Events
        </h1>
        <Link
          href="/admin/events/new"
          className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          <Plus className="h-4 w-4" />
          New Event
        </Link>
      </div>

      {events.length === 0 ? (
        <div className="bg-white rounded-xl border border-neutral-200 p-12 text-center">
          <Calendar className="h-12 w-12 text-neutral-400 mx-auto mb-4" />
          <p className="text-neutral-600 mb-4">No events yet.</p>
          <Link
            href="/admin/events/new"
            className="text-primary-600 hover:text-primary-700 font-medium"
          >
            Create your first event
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-neutral-50 border-b border-neutral-200">
              <tr>
                <th className="text-left px-6 py-3 text-sm font-semibold text-neutral-600">Event</th>
                <th className="text-left px-6 py-3 text-sm font-semibold text-neutral-600">Date</th>
                <th className="text-left px-6 py-3 text-sm font-semibold text-neutral-600">Status</th>
                <th className="text-left px-6 py-3 text-sm font-semibold text-neutral-600">Registrations</th>
                <th className="text-right px-6 py-3 text-sm font-semibold text-neutral-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {events.map((event) => {
                const isPast = event.eventDate < new Date();
                const formattedDate = event.eventDate.toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                });

                return (
                  <tr key={event.id} className="hover:bg-neutral-50">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-neutral-800">{event.title}</p>
                        <p className="text-sm text-neutral-500">{event.location}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        'text-sm',
                        isPast ? 'text-neutral-400' : 'text-neutral-600'
                      )}>
                        {formattedDate}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        'inline-flex px-2 py-1 text-xs font-medium rounded-full',
                        event.status === 'published' && 'bg-green-100 text-green-700',
                        event.status === 'draft' && 'bg-neutral-100 text-neutral-600',
                        event.status === 'cancelled' && 'bg-red-100 text-red-700'
                      )}>
                        {event.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 text-sm">
                        <Users className="h-4 w-4 text-neutral-400" />
                        <span className="text-neutral-600">
                          {event.confirmedCount}/{event.maxAttendees}
                        </span>
                        {event.waitlistCount > 0 && (
                          <span className="text-amber-600">
                            (+{event.waitlistCount} waitlist)
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <Link
                          href={`/admin/events/${event.id}`}
                          className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                        >
                          Edit
                        </Link>
                        <Link
                          href={`/admin/events/${event.id}/registrations`}
                          className="text-sm text-neutral-600 hover:text-neutral-800 font-medium"
                        >
                          Registrations
                        </Link>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
