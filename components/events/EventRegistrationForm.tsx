'use client';

import { useActionState, useState, useRef, useEffect } from 'react';
import { registerForEvent, type RegistrationFormState } from '@/lib/actions/events';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Turnstile } from '@/components/ui/Turnstile';
import { cn } from '@/lib/utils';
import { CheckCircle, Clock } from 'lucide-react';

interface EventRegistrationFormProps {
  eventId: number;
  isFull: boolean;
  className?: string;
  seriesId?: string | null;
  seriesEventCount?: number;
}

const initialState: RegistrationFormState = {
  success: false,
  message: '',
};

export function EventRegistrationForm({ eventId, isFull, className, seriesId, seriesEventCount }: EventRegistrationFormProps) {
  const [state, formAction, isPending] = useActionState(registerForEvent, initialState);
  const [turnstileToken, setTurnstileToken] = useState('');
  const [registerForSeries, setRegisterForSeries] = useState(false);
  const [showTurnstile, setShowTurnstile] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const showSeriesOption = seriesId && seriesEventCount && seriesEventCount > 1;

  // Auto-submit when turnstile token is received
  useEffect(() => {
    if (turnstileToken && showTurnstile && formRef.current) {
      formRef.current.requestSubmit();
    }
  }, [turnstileToken, showTurnstile]);

  const handleButtonClick = (e: React.MouseEvent) => {
    if (!turnstileToken && !showTurnstile) {
      e.preventDefault();
      setShowTurnstile(true);
    }
  };

  // Show success state
  if (state.success && state.message) {
    const isWaitlisted = state.status === 'waitlisted';

    return (
      <div className={cn(
        'p-6 rounded-xl',
        isWaitlisted ? 'bg-amber-50' : 'bg-green-50',
        className
      )}>
        <div className="flex items-start gap-3">
          {isWaitlisted ? (
            <Clock className="h-6 w-6 text-amber-600 flex-shrink-0 mt-0.5" />
          ) : (
            <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-0.5" />
          )}
          <div>
            <h3 className={cn(
              'font-semibold',
              isWaitlisted ? 'text-amber-800' : 'text-green-800'
            )}>
              {isWaitlisted ? "You're on the waitlist!" : "You're registered!"}
            </h3>
            <p className={cn(
              isWaitlisted ? 'text-amber-700' : 'text-green-700'
            )}>
              {state.message}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form ref={formRef} action={formAction} className={cn('space-y-4', className)}>
      <input type="hidden" name="eventId" value={eventId} />
      {seriesId && <input type="hidden" name="seriesId" value={seriesId} />}
      <input type="hidden" name="registerForSeries" value={registerForSeries ? "true" : "false"} />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          name="firstName"
          type="text"
          label="First Name"
          placeholder="Your first name"
          required
          error={state.errors?.firstName?.[0]}
        />
        <Input
          name="lastName"
          type="text"
          label="Last Name"
          placeholder="Your last name"
          error={state.errors?.lastName?.[0]}
        />
      </div>

      <Input
        name="email"
        type="email"
        label="Email"
        placeholder="you@example.com"
        required
        error={state.errors?.email?.[0]}
      />

      {showSeriesOption && (
        <div className="flex items-start gap-3 p-4 bg-primary-50 rounded-lg">
          <input
            type="checkbox"
            id="registerForSeries"
            checked={registerForSeries}
            onChange={(e) => setRegisterForSeries(e.target.checked)}
            className="h-4 w-4 mt-0.5 rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
          />
          <label htmlFor="registerForSeries" className="text-sm">
            <span className="font-medium text-primary-800">Register for all {seriesEventCount} events in this series</span>
            <p className="text-primary-600 mt-0.5">
              You&apos;ll be signed up for all upcoming events in one go.
            </p>
          </label>
        </div>
      )}

      <input type="hidden" name="turnstileToken" value={turnstileToken} />
      {showTurnstile && <Turnstile onSuccess={setTurnstileToken} />}

      {state.message && !state.success && (
        <p className="text-red-500 text-sm">{state.message}</p>
      )}

      <Button
        type="submit"
        size="lg"
        isLoading={isPending || (showTurnstile && !turnstileToken)}
        className="w-full"
        variant={isFull ? 'secondary' : 'primary'}
        onClick={handleButtonClick}
      >
        {isFull ? 'Join Waitlist' : 'Register'}
      </Button>

      {isFull && (
        <p className="text-sm text-neutral-500 text-center">
          This event is full, but you can join the waitlist.
        </p>
      )}
    </form>
  );
}
