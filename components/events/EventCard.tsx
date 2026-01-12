import Link from 'next/link';
import { Calendar, MapPin, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Event } from '@/lib/db/schema';

interface EventCardProps {
  event: Event;
  confirmedCount?: number;
  className?: string;
}

export function EventCard({ event, confirmedCount = 0, className }: EventCardProps) {
  const spotsRemaining = event.maxAttendees - confirmedCount;
  const isFull = spotsRemaining <= 0;

  const formattedDate = event.eventDate.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  const formattedTime = event.eventDate.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });

  return (
    <Link
      href={`/events/${event.slug}`}
      className={cn(
        'block bg-white rounded-xl border border-neutral-200 overflow-hidden',
        'hover:border-primary-300 hover:shadow-lg transition-all',
        className
      )}
    >
      <div className="p-6">
        <div className="flex items-center gap-2 text-sm text-primary-600 font-medium mb-3">
          <Calendar className="h-4 w-4" />
          <span>{formattedDate} at {formattedTime}</span>
        </div>

        <h3 className="text-xl font-semibold text-neutral-800 mb-2">
          {event.title}
        </h3>

        {event.shortDescription && (
          <p className="text-neutral-600 text-sm mb-4 line-clamp-2">
            {event.shortDescription}
          </p>
        )}

        <div className="flex items-center gap-4 text-sm text-neutral-500">
          <div className="flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            <span className="truncate max-w-[150px]">{event.location}</span>
          </div>

          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            {isFull ? (
              <span className="text-amber-600 font-medium">Waitlist</span>
            ) : (
              <span>{spotsRemaining} spots left</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
