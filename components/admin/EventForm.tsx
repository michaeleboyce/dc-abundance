'use client';

import { useActionState, useState, useMemo } from 'react';
import { createEvent, createRecurringEvent, updateEvent, type EventFormState } from '@/lib/actions/admin-events';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import type { Event } from '@/lib/db/schema';
import {
  DAYS_OF_WEEK,
  WEEKS_OF_MONTH,
  generateWeeklyDates,
  generateMonthlyDates,
  getMaxOccurrences,
  type DayOfWeek,
  type WeekOfMonth,
} from '@/lib/recurrence';

interface EventFormProps {
  event?: Event;
}

const initialState: EventFormState = {
  success: false,
  message: '',
};

export function EventForm({ event }: EventFormProps) {
  const isEditing = !!event;
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurrenceType, setRecurrenceType] = useState<'weekly' | 'monthly'>('weekly');
  const [intervalWeeks, setIntervalWeeks] = useState(1);
  const [dayOfWeek, setDayOfWeek] = useState<DayOfWeek>(2); // Tuesday
  const [weekOfMonth, setWeekOfMonth] = useState<WeekOfMonth>(2); // 2nd week
  const [occurrences, setOccurrences] = useState(4);
  const [startDate, setStartDate] = useState('');

  // Create bound action for update or create
  const action = isEditing
    ? updateEvent.bind(null, event.id)
    : isRecurring
    ? createRecurringEvent
    : createEvent;

  const [state, formAction, isPending] = useActionState(action, initialState);

  // Format date for datetime-local input
  const formatDateForInput = (date: Date) => {
    return date.toISOString().slice(0, 16);
  };

  // Calculate max occurrences based on recurrence type
  const maxOccurrences = useMemo(() => {
    return getMaxOccurrences(recurrenceType, intervalWeeks);
  }, [recurrenceType, intervalWeeks]);

  // Generate preview dates
  const previewDates = useMemo(() => {
    if (!startDate || !isRecurring) return [];

    const start = new Date(startDate);
    if (isNaN(start.getTime())) return [];

    try {
      if (recurrenceType === 'weekly') {
        return generateWeeklyDates(start, intervalWeeks, Math.min(occurrences, 10));
      } else {
        return generateMonthlyDates(start, dayOfWeek, weekOfMonth, Math.min(occurrences, 10));
      }
    } catch {
      return [];
    }
  }, [startDate, isRecurring, recurrenceType, intervalWeeks, dayOfWeek, weekOfMonth, occurrences]);

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

        {!isRecurring && (
          <>
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
          </>
        )}

        <Input
          name="ownerEmail"
          type="email"
          label="Event Owner Email"
          placeholder="owner@example.com"
          required
          defaultValue={event?.ownerEmail}
          error={state.errors?.ownerEmail?.[0]}
        />

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="showOwnerEmail"
            name="showOwnerEmail"
            defaultChecked={event?.showOwnerEmail}
            className="h-4 w-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
          />
          <label htmlFor="showOwnerEmail" className="text-sm text-neutral-700">
            Show owner email on public event page
          </label>
        </div>

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
          label={isRecurring ? "First Event Date & Time" : "Event Date & Time"}
          required
          defaultValue={event ? formatDateForInput(event.eventDate) : ''}
          onChange={(e) => setStartDate(e.target.value)}
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

        {/* Recurrence Section - only for new events */}
        {!isEditing && (
          <div className="border border-neutral-200 rounded-lg p-4 space-y-4">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isRecurring"
                name="isRecurring"
                checked={isRecurring}
                onChange={(e) => setIsRecurring(e.target.checked)}
                className="h-4 w-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
              />
              <label htmlFor="isRecurring" className="text-sm font-medium text-neutral-700">
                This is a recurring event
              </label>
            </div>

            {isRecurring && (
              <div className="space-y-4 pt-2">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                    Recurrence Pattern
                  </label>
                  <select
                    name="recurrenceType"
                    value={recurrenceType}
                    onChange={(e) => setRecurrenceType(e.target.value as 'weekly' | 'monthly')}
                    className={cn(
                      'w-full px-4 py-3 rounded-lg border border-neutral-200 bg-white',
                      'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent'
                    )}
                  >
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly (specific weekday)</option>
                  </select>
                </div>

                {recurrenceType === 'weekly' && (
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                      Repeat every
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        name="intervalWeeks"
                        min={1}
                        max={12}
                        value={intervalWeeks}
                        onChange={(e) => setIntervalWeeks(parseInt(e.target.value) || 1)}
                        className="w-20 px-3 py-2 rounded-lg border border-neutral-200 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                      <span className="text-neutral-600">week(s)</span>
                    </div>
                  </div>
                )}

                {recurrenceType === 'monthly' && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                        Week of month
                      </label>
                      <select
                        name="weekOfMonth"
                        value={weekOfMonth}
                        onChange={(e) => setWeekOfMonth(parseInt(e.target.value) as WeekOfMonth)}
                        className={cn(
                          'w-full px-4 py-3 rounded-lg border border-neutral-200 bg-white',
                          'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent'
                        )}
                      >
                        {WEEKS_OF_MONTH.map((week) => (
                          <option key={week.value} value={week.value}>
                            {week.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                        Day of week
                      </label>
                      <select
                        name="dayOfWeek"
                        value={dayOfWeek}
                        onChange={(e) => setDayOfWeek(parseInt(e.target.value) as DayOfWeek)}
                        className={cn(
                          'w-full px-4 py-3 rounded-lg border border-neutral-200 bg-white',
                          'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent'
                        )}
                      >
                        {DAYS_OF_WEEK.map((day) => (
                          <option key={day.value} value={day.value}>
                            {day.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                    Number of occurrences
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      name="occurrences"
                      min={2}
                      max={maxOccurrences}
                      value={occurrences}
                      onChange={(e) => setOccurrences(parseInt(e.target.value) || 2)}
                      className="w-20 px-3 py-2 rounded-lg border border-neutral-200 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                    <span className="text-neutral-500 text-sm">
                      (max {maxOccurrences} for 2 years)
                    </span>
                  </div>
                </div>

                {/* Date Preview */}
                {previewDates.length > 0 && (
                  <div className="bg-neutral-50 rounded-lg p-3">
                    <p className="text-sm font-medium text-neutral-700 mb-2">
                      Preview ({occurrences > 10 ? 'first 10 of ' : ''}{occurrences} events):
                    </p>
                    <ul className="text-sm text-neutral-600 space-y-1">
                      {previewDates.map((date, i) => (
                        <li key={i}>
                          {date.toLocaleDateString('en-US', {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                          {' at '}
                          {date.toLocaleTimeString('en-US', {
                            hour: 'numeric',
                            minute: '2-digit',
                          })}
                        </li>
                      ))}
                      {occurrences > 10 && <li>...</li>}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {state.message && !state.success && (
        <p className="text-red-500 text-sm">{state.message}</p>
      )}

      <div className="flex gap-4">
        <Button type="submit" size="lg" isLoading={isPending}>
          {isEditing ? 'Update Event' : isRecurring ? `Create ${occurrences} Events` : 'Create Event'}
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
