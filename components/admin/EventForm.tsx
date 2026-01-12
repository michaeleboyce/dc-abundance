'use client';

import { useActionState } from 'react';
import { createEvent, updateEvent, type EventFormState } from '@/lib/actions/admin-events';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import type { Event } from '@/lib/db/schema';

interface EventFormProps {
  event?: Event;
}

const initialState: EventFormState = {
  success: false,
  message: '',
};

export function EventForm({ event }: EventFormProps) {
  const isEditing = !!event;

  // Create bound action for update
  const boundUpdateEvent = event
    ? updateEvent.bind(null, event.id)
    : createEvent;

  const [state, formAction, isPending] = useActionState(
    boundUpdateEvent,
    initialState
  );

  // Format date for datetime-local input
  const formatDateForInput = (date: Date) => {
    return date.toISOString().slice(0, 16);
  };

  // Generate slug from title
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  return (
    <form action={formAction} className="space-y-6 max-w-2xl">
      <div className="space-y-4">
        <Input
          name="title"
          type="text"
          label="Title"
          placeholder="January DC Abundance Meetup"
          required
          defaultValue={event?.title}
          error={state.errors?.title?.[0]}
        />

        <Input
          name="slug"
          type="text"
          label="URL Slug"
          placeholder="january-dc-abundance-meetup"
          required
          defaultValue={event?.slug}
          error={state.errors?.slug?.[0]}
        />
        <p className="text-xs text-neutral-500 -mt-3">
          This will be the URL: /events/your-slug-here
        </p>

        <Input
          name="shortDescription"
          type="text"
          label="Short Description (optional)"
          placeholder="A brief summary for event cards"
          defaultValue={event?.shortDescription || ''}
          error={state.errors?.shortDescription?.[0]}
        />

        <Textarea
          name="description"
          label="Full Description"
          placeholder="Detailed information about the event..."
          required
          rows={6}
          defaultValue={event?.description}
          error={state.errors?.description?.[0]}
        />

        <Input
          name="eventDate"
          type="datetime-local"
          label="Event Date & Time"
          required
          defaultValue={event ? formatDateForInput(event.eventDate) : ''}
          error={state.errors?.eventDate?.[0]}
        />

        <Input
          name="location"
          type="text"
          label="Location"
          placeholder="The Coffee Shop"
          required
          defaultValue={event?.location}
          error={state.errors?.location?.[0]}
        />

        <Input
          name="locationAddress"
          type="text"
          label="Address (optional)"
          placeholder="123 Main St, Washington, DC 20001"
          defaultValue={event?.locationAddress || ''}
          error={state.errors?.locationAddress?.[0]}
        />

        <Input
          name="maxAttendees"
          type="number"
          label="Maximum Attendees"
          placeholder="25"
          required
          min={1}
          defaultValue={event?.maxAttendees || ''}
          error={state.errors?.maxAttendees?.[0]}
        />

        <div>
          <label
            htmlFor="status"
            className="block text-sm font-medium text-neutral-700 mb-1.5"
          >
            Status
          </label>
          <select
            id="status"
            name="status"
            defaultValue={event?.status || 'draft'}
            className={cn(
              'w-full px-4 py-3 rounded-lg border border-neutral-200 bg-white',
              'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
              'transition-colors'
            )}
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {state.message && !state.success && (
        <p className="text-red-500 text-sm">{state.message}</p>
      )}

      <div className="flex gap-4">
        <Button type="submit" size="lg" isLoading={isPending}>
          {isEditing ? 'Update Event' : 'Create Event'}
        </Button>
        <a
          href="/admin/events"
          className="px-6 py-3 text-neutral-600 hover:text-neutral-800 font-medium"
        >
          Cancel
        </a>
      </div>
    </form>
  );
}
