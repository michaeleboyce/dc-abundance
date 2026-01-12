import Link from 'next/link';
import { db } from '@/lib/db';
import { events, eventRegistrations, newsletterSubscribers, contactSubmissions } from '@/lib/db/schema';
import { count, eq, and, gt } from 'drizzle-orm';
import { Calendar, Mail, MessageSquare, Users } from 'lucide-react';

async function getStats() {
  const [upcomingEventsCount] = await db
    .select({ count: count() })
    .from(events)
    .where(
      and(
        eq(events.status, 'published'),
        gt(events.eventDate, new Date())
      )
    );

  const [totalRegistrations] = await db
    .select({ count: count() })
    .from(eventRegistrations)
    .where(eq(eventRegistrations.status, 'confirmed'));

  const [activeSubscribers] = await db
    .select({ count: count() })
    .from(newsletterSubscribers)
    .where(eq(newsletterSubscribers.isActive, true));

  const [unreadMessages] = await db
    .select({ count: count() })
    .from(contactSubmissions)
    .where(eq(contactSubmissions.isRead, false));

  return {
    upcomingEvents: upcomingEventsCount?.count || 0,
    totalRegistrations: totalRegistrations?.count || 0,
    activeSubscribers: activeSubscribers?.count || 0,
    unreadMessages: unreadMessages?.count || 0,
  };
}

export default async function AdminDashboard() {
  const stats = await getStats();

  return (
    <div>
      <h1 className="text-2xl font-display font-bold text-neutral-800 mb-8">
        Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Link
          href="/admin/events"
          className="bg-white rounded-xl border border-neutral-200 p-6 hover:border-primary-300 hover:shadow-md transition-all"
        >
          <div className="flex items-center gap-4">
            <div className="bg-primary-100 p-3 rounded-lg">
              <Calendar className="h-6 w-6 text-primary-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-neutral-800">{stats.upcomingEvents}</p>
              <p className="text-sm text-neutral-600">Upcoming Events</p>
            </div>
          </div>
        </Link>

        <Link
          href="/admin/events"
          className="bg-white rounded-xl border border-neutral-200 p-6 hover:border-primary-300 hover:shadow-md transition-all"
        >
          <div className="flex items-center gap-4">
            <div className="bg-green-100 p-3 rounded-lg">
              <Users className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-neutral-800">{stats.totalRegistrations}</p>
              <p className="text-sm text-neutral-600">Event Registrations</p>
            </div>
          </div>
        </Link>

        <Link
          href="/admin/subscribers"
          className="bg-white rounded-xl border border-neutral-200 p-6 hover:border-primary-300 hover:shadow-md transition-all"
        >
          <div className="flex items-center gap-4">
            <div className="bg-amber-100 p-3 rounded-lg">
              <Mail className="h-6 w-6 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-neutral-800">{stats.activeSubscribers}</p>
              <p className="text-sm text-neutral-600">Active Subscribers</p>
            </div>
          </div>
        </Link>

        <Link
          href="/admin/messages"
          className="bg-white rounded-xl border border-neutral-200 p-6 hover:border-primary-300 hover:shadow-md transition-all"
        >
          <div className="flex items-center gap-4">
            <div className="bg-blue-100 p-3 rounded-lg">
              <MessageSquare className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-neutral-800">{stats.unreadMessages}</p>
              <p className="text-sm text-neutral-600">Unread Messages</p>
            </div>
          </div>
        </Link>
      </div>

      <div className="mt-8 bg-white rounded-xl border border-neutral-200 p-6">
        <h2 className="text-lg font-semibold text-neutral-800 mb-4">Quick Actions</h2>
        <div className="flex gap-4">
          <Link
            href="/admin/events/new"
            className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            Create Event
          </Link>
        </div>
      </div>
    </div>
  );
}
