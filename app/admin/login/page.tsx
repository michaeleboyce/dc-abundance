'use client';

import { useActionState, useState, useRef } from 'react';
import { adminLogin, type LoginFormState } from '@/lib/actions/admin-auth';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Turnstile } from '@/components/ui/Turnstile';
import { Lock } from 'lucide-react';

const initialState: LoginFormState = {
  success: false,
  message: '',
};

export default function AdminLoginPage() {
  const [state, formAction, isPending] = useActionState(adminLogin, initialState);
  const [turnstileToken, setTurnstileToken] = useState<string>('');
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = (formData: FormData) => {
    // Add the turnstile token to the form data
    if (turnstileToken) {
      formData.set('turnstileToken', turnstileToken);
    }
    formAction(formData);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 px-4">
      <div className="w-full max-w-sm">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex justify-center mb-6">
            <div className="bg-primary-100 p-3 rounded-full">
              <Lock className="h-6 w-6 text-primary-600" />
            </div>
          </div>

          <h1 className="text-2xl font-display font-bold text-neutral-800 text-center mb-2">
            Admin Login
          </h1>
          <p className="text-neutral-600 text-center mb-6">
            Enter the admin password to continue.
          </p>

          <form ref={formRef} action={handleSubmit} className="space-y-4">
            <Input
              name="password"
              type="password"
              label="Password"
              placeholder="Enter password"
              required
              error={state.errors?.password?.[0]}
            />

            <Turnstile
              onSuccess={setTurnstileToken}
              onError={() => setTurnstileToken('')}
              onExpire={() => setTurnstileToken('')}
            />

            {state.message && !state.success && (
              <p className="text-red-500 text-sm">{state.message}</p>
            )}

            <Button type="submit" size="lg" isLoading={isPending} className="w-full">
              Login
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
