'use client';

import { useActionState, useState, useRef, useEffect } from 'react';
import { subscribeToNewsletter, type NewsletterFormState } from '@/lib/actions/newsletter';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Turnstile } from '@/components/ui/Turnstile';
import { cn } from '@/lib/utils';
import { CheckCircle } from 'lucide-react';

interface NewsletterFormProps {
  variant?: 'hero' | 'section' | 'compact';
  className?: string;
  dark?: boolean;
}

const initialState: NewsletterFormState = {
  success: false,
  message: '',
};

export function NewsletterForm({ variant = 'section', className, dark }: NewsletterFormProps) {
  const [state, formAction, isPending] = useActionState(subscribeToNewsletter, initialState);
  const [turnstileToken, setTurnstileToken] = useState('');
  const [showTurnstile, setShowTurnstile] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

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
    return (
      <div className={cn('flex items-center gap-3 p-4 bg-green-50 rounded-lg', className)}>
        <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
        <p className="text-green-800 font-medium">{state.message}</p>
      </div>
    );
  }

  // Compact variant - just email
  if (variant === 'compact') {
    return (
      <form ref={formRef} action={formAction} className={cn('space-y-3', className)}>
        <div className="flex gap-2">
          <Input
            name="email"
            type="email"
            placeholder="Enter your email"
            required
            error={state.errors?.email?.[0]}
            className="flex-1"
          />
          <Button type="submit" isLoading={isPending || (showTurnstile && !turnstileToken)} onClick={handleButtonClick}>
            Subscribe
          </Button>
        </div>
        <input type="hidden" name="turnstileToken" value={turnstileToken} />
        {showTurnstile && <Turnstile onSuccess={setTurnstileToken} />}
      </form>
    );
  }

  // Hero variant - horizontal layout on desktop
  if (variant === 'hero') {
    return (
      <form ref={formRef} action={formAction} className={cn('w-full max-w-xl space-y-3', className)}>
        <div className="flex flex-col sm:flex-row gap-3">
          <Input
            name="email"
            type="email"
            placeholder="Enter your email"
            required
            error={state.errors?.email?.[0]}
            className="flex-1 bg-white/95"
          />
          <Button type="submit" size="lg" isLoading={isPending || (showTurnstile && !turnstileToken)} onClick={handleButtonClick} className="sm:w-auto">
            Join the Movement
          </Button>
        </div>
        <input type="hidden" name="turnstileToken" value={turnstileToken} />
        {showTurnstile && <Turnstile onSuccess={setTurnstileToken} />}
        {state.message && !state.success && (
          <p className="mt-2 text-red-200 text-sm">{state.message}</p>
        )}
      </form>
    );
  }

  // Section variant - full form with optional fields
  return (
    <form ref={formRef} action={formAction} className={cn('w-full max-w-md space-y-4', className)}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          name="firstName"
          type="text"
          label="First Name"
          placeholder="Your first name"
          error={state.errors?.firstName?.[0]}
          dark={dark}
        />
        <Input
          name="lastName"
          type="text"
          label="Last Name"
          placeholder="Your last name"
          error={state.errors?.lastName?.[0]}
          dark={dark}
        />
      </div>
      <Input
        name="email"
        type="email"
        label="Email"
        placeholder="you@example.com"
        required
        error={state.errors?.email?.[0]}
        dark={dark}
      />
      <Input
        name="zipCode"
        type="text"
        label="ZIP Code (optional)"
        placeholder="20001"
        error={state.errors?.zipCode?.[0]}
        dark={dark}
      />
      <input type="hidden" name="turnstileToken" value={turnstileToken} />
      {showTurnstile && <Turnstile onSuccess={setTurnstileToken} />}
      {state.message && !state.success && (
        <p className={cn('text-sm', dark ? 'text-red-300' : 'text-red-500')}>{state.message}</p>
      )}
      <Button type="submit" size="lg" isLoading={isPending || (showTurnstile && !turnstileToken)} onClick={handleButtonClick} className="w-full">
        Join the Movement
      </Button>
    </form>
  );
}
