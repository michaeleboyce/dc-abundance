'use client';

import { Turnstile as TurnstileWidget } from '@marsidev/react-turnstile';
import { cn } from '@/lib/utils';

interface TurnstileProps {
  onSuccess: (token: string) => void;
  onError?: () => void;
  onExpire?: () => void;
  className?: string;
}

export function Turnstile({ onSuccess, onError, onExpire, className }: TurnstileProps) {
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

  // In development without key, render nothing
  if (!siteKey) {
    return null;
  }

  return (
    <div className={cn('w-full', className)}>
      <TurnstileWidget
        siteKey={siteKey}
        onSuccess={onSuccess}
        onError={onError}
        onExpire={onExpire}
        options={{
          theme: 'light',
        }}
      />
    </div>
  );
}
