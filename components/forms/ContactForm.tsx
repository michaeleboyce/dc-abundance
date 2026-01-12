'use client';

import { useActionState, useState } from 'react';
import { submitContactForm, type ContactFormState } from '@/lib/actions/contact';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { Turnstile } from '@/components/ui/Turnstile';
import { cn } from '@/lib/utils';
import { CheckCircle } from 'lucide-react';

interface ContactFormProps {
  className?: string;
}

const initialState: ContactFormState = {
  success: false,
  message: '',
};

const inquiryTypes = [
  { value: 'general', label: 'General Inquiry' },
  { value: 'housing', label: 'Housing' },
  { value: 'transportation', label: 'Transportation' },
  { value: 'energy', label: 'Energy' },
  { value: 'government', label: 'Government' },
  { value: 'partnership', label: 'Partnership' },
  { value: 'media', label: 'Media/Press' },
  { value: 'volunteer', label: 'Volunteer' },
];

export function ContactForm({ className }: ContactFormProps) {
  const [state, formAction, isPending] = useActionState(submitContactForm, initialState);
  const [turnstileToken, setTurnstileToken] = useState('');

  // Show success state
  if (state.success && state.message) {
    return (
      <div className={cn('p-6 bg-green-50 rounded-xl', className)}>
        <div className="flex items-center gap-3">
          <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-green-800">Message Sent!</h3>
            <p className="text-green-700">{state.message}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form action={formAction} className={cn('space-y-6', className)}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <Input
          name="name"
          type="text"
          label="Name"
          placeholder="Your name"
          required
          error={state.errors?.name?.[0]}
        />
        <Input
          name="email"
          type="email"
          label="Email"
          placeholder="you@example.com"
          required
          error={state.errors?.email?.[0]}
        />
      </div>

      <div>
        <label
          htmlFor="inquiryType"
          className="block text-sm font-medium text-neutral-700 mb-1.5"
        >
          Inquiry Type
        </label>
        <select
          id="inquiryType"
          name="inquiryType"
          defaultValue="general"
          className={cn(
            'w-full px-4 py-3 rounded-lg border border-neutral-200 bg-white',
            'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
            'transition-colors',
            state.errors?.inquiryType && 'border-red-500 focus:ring-red-500'
          )}
        >
          {inquiryTypes.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
        {state.errors?.inquiryType?.[0] && (
          <p className="mt-1.5 text-sm text-red-500">{state.errors.inquiryType[0]}</p>
        )}
      </div>

      <Input
        name="subject"
        type="text"
        label="Subject"
        placeholder="What is this about?"
        required
        error={state.errors?.subject?.[0]}
      />

      <Textarea
        name="message"
        label="Message"
        placeholder="Tell us more..."
        required
        rows={6}
        error={state.errors?.message?.[0]}
      />

      <input type="hidden" name="turnstileToken" value={turnstileToken} />
      <Turnstile onSuccess={setTurnstileToken} />

      {state.message && !state.success && (
        <p className="text-red-500 text-sm">{state.message}</p>
      )}

      <Button type="submit" size="lg" isLoading={isPending}>
        Send Message
      </Button>
    </form>
  );
}
