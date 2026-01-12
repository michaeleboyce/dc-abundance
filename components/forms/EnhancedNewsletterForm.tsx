'use client';

import { useActionState, useState, useRef, useEffect } from 'react';
import { subscribeWithProfile, type NewsletterFormState } from '@/lib/actions/newsletter';
import { RESIDENCE_OPTIONS, INTEREST_OPTIONS, HELP_OPTIONS } from '@/lib/db/schema';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Turnstile } from '@/components/ui/Turnstile';
import { cn } from '@/lib/utils';
import { CheckCircle, MapPin, Heart, Users } from 'lucide-react';

interface EnhancedNewsletterFormProps {
  className?: string;
  source?: string;
}

const initialState: NewsletterFormState = {
  success: false,
  message: '',
};

export function EnhancedNewsletterForm({ className, source = 'website' }: EnhancedNewsletterFormProps) {
  const [state, formAction, isPending] = useActionState(subscribeWithProfile, initialState);
  const [turnstileToken, setTurnstileToken] = useState('');
  const [showTurnstile, setShowTurnstile] = useState(false);
  const [interests, setInterests] = useState<string[]>([]);
  const [helpPreferences, setHelpPreferences] = useState<string[]>([]);
  const [showOtherInterest, setShowOtherInterest] = useState(false);
  const [showOtherHelp, setShowOtherHelp] = useState(false);
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

  const handleInterestChange = (interest: string) => {
    if (interest === 'Other') {
      setShowOtherInterest(!showOtherInterest);
      if (!showOtherInterest) {
        setInterests([...interests, interest]);
      } else {
        setInterests(interests.filter((i) => i !== interest));
      }
    } else {
      setInterests((prev) =>
        prev.includes(interest) ? prev.filter((i) => i !== interest) : [...prev, interest]
      );
    }
  };

  const handleHelpChange = (help: string) => {
    if (help === 'Other') {
      setShowOtherHelp(!showOtherHelp);
      if (!showOtherHelp) {
        setHelpPreferences([...helpPreferences, help]);
      } else {
        setHelpPreferences(helpPreferences.filter((h) => h !== help));
      }
    } else {
      setHelpPreferences((prev) =>
        prev.includes(help) ? prev.filter((h) => h !== help) : [...prev, help]
      );
    }
  };

  // Show success state
  if (state.success && state.message) {
    return (
      <div className={cn('p-8 bg-green-50 rounded-xl text-center', className)}>
        <div className="flex justify-center mb-4">
          <div className="p-3 bg-green-100 rounded-full">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </div>
        <h3 className="text-xl font-semibold text-green-800">Welcome to DC Abundance!</h3>
        <p className="mt-2 text-green-700">{state.message}</p>
      </div>
    );
  }

  return (
    <form ref={formRef} action={formAction} className={cn('space-y-8', className)}>
      <input type="hidden" name="source" value={source} />
      <input type="hidden" name="turnstileToken" value={turnstileToken} />
      {interests.map((interest) => (
        <input key={interest} type="hidden" name="interests" value={interest} />
      ))}
      {helpPreferences.map((pref) => (
        <input key={pref} type="hidden" name="helpPreferences" value={pref} />
      ))}

      {/* Basic Info Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-neutral-800 flex items-center gap-2">
          <Users className="h-5 w-5 text-primary-600" />
          About You
        </h3>
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
        <Input
          name="zipCode"
          type="text"
          label="ZIP Code"
          placeholder="20001"
          error={state.errors?.zipCode?.[0]}
        />
      </div>

      {/* Location Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-neutral-800 flex items-center gap-2">
          <MapPin className="h-5 w-5 text-primary-600" />
          Where do you live?
        </h3>
        <select
          name="residence"
          className="w-full px-4 py-3 rounded-lg border border-neutral-300 bg-white text-neutral-800 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        >
          <option value="">Select your area...</option>
          {RESIDENCE_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      {/* Interests Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-neutral-800 flex items-center gap-2">
          <Heart className="h-5 w-5 text-primary-600" />
          What policy areas interest you?
        </h3>
        <p className="text-sm text-neutral-600">Select all that apply</p>
        <div className="space-y-3">
          {INTEREST_OPTIONS.map((option) => (
            <label
              key={option}
              className={cn(
                'flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors',
                interests.includes(option)
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-neutral-200 hover:border-neutral-300'
              )}
            >
              <input
                type="checkbox"
                checked={interests.includes(option)}
                onChange={() => handleInterestChange(option)}
                className="h-5 w-5 mt-0.5 rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="text-neutral-700">{option}</span>
            </label>
          ))}
        </div>
        {showOtherInterest && (
          <Input
            name="otherInterest"
            type="text"
            placeholder="What other topics interest you?"
            className="mt-2"
          />
        )}
      </div>

      {/* Help Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-neutral-800">
          Would you like to help organize events or activities?
        </h3>
        <p className="text-sm text-neutral-600">Select all that apply (optional)</p>
        <div className="space-y-3">
          {HELP_OPTIONS.map((option) => (
            <label
              key={option}
              className={cn(
                'flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors',
                helpPreferences.includes(option)
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-neutral-200 hover:border-neutral-300'
              )}
            >
              <input
                type="checkbox"
                checked={helpPreferences.includes(option)}
                onChange={() => handleHelpChange(option)}
                className="h-5 w-5 mt-0.5 rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="text-neutral-700">{option}</span>
            </label>
          ))}
        </div>
        {showOtherHelp && (
          <Input
            name="otherHelp"
            type="text"
            placeholder="How else would you like to help?"
            className="mt-2"
          />
        )}
      </div>

      {/* Turnstile & Submit */}
      {showTurnstile && <Turnstile onSuccess={setTurnstileToken} />}

      {state.message && !state.success && (
        <p className="text-red-500 text-sm">{state.message}</p>
      )}

      <Button
        type="submit"
        size="lg"
        isLoading={isPending || (showTurnstile && !turnstileToken)}
        onClick={handleButtonClick}
        className="w-full"
      >
        Join DC Abundance
      </Button>
    </form>
  );
}
