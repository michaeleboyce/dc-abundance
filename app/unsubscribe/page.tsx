import type { Metadata } from 'next';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Unsubscribe | DC Abundance',
  description: 'Unsubscribe from DC Abundance emails.',
};

export default async function UnsubscribePage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string; error?: string }>;
}) {
  const { success, error } = await searchParams;

  return (
    <section className="py-16 lg:py-24">
      <Container>
        <div className="max-w-xl mx-auto text-center">
          {success && (
            <>
              <div className="bg-green-100 p-4 rounded-full w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h1 className="text-3xl font-display font-bold text-neutral-800 mb-4">
                You've been unsubscribed
              </h1>
              <p className="text-neutral-600 mb-8">
                We're sorry to see you go. You will no longer receive emails from DC Abundance.
              </p>
              <Link
                href="/"
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                Return to homepage
              </Link>
            </>
          )}

          {error === 'invalid-token' && (
            <>
              <div className="bg-amber-100 p-4 rounded-full w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                <AlertCircle className="h-8 w-8 text-amber-600" />
              </div>
              <h1 className="text-3xl font-display font-bold text-neutral-800 mb-4">
                Invalid link
              </h1>
              <p className="text-neutral-600 mb-8">
                This unsubscribe link is invalid or has already been used.
              </p>
              <Link
                href="/"
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                Return to homepage
              </Link>
            </>
          )}

          {error === 'missing-token' && (
            <>
              <div className="bg-amber-100 p-4 rounded-full w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                <AlertCircle className="h-8 w-8 text-amber-600" />
              </div>
              <h1 className="text-3xl font-display font-bold text-neutral-800 mb-4">
                Missing token
              </h1>
              <p className="text-neutral-600 mb-8">
                This unsubscribe link appears to be incomplete.
              </p>
              <Link
                href="/"
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                Return to homepage
              </Link>
            </>
          )}

          {error === 'server-error' && (
            <>
              <div className="bg-red-100 p-4 rounded-full w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                <XCircle className="h-8 w-8 text-red-600" />
              </div>
              <h1 className="text-3xl font-display font-bold text-neutral-800 mb-4">
                Something went wrong
              </h1>
              <p className="text-neutral-600 mb-8">
                We couldn't process your request. Please try again or contact us directly.
              </p>
              <Link
                href="/contact"
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                Contact us
              </Link>
            </>
          )}

          {!success && !error && (
            <>
              <h1 className="text-3xl font-display font-bold text-neutral-800 mb-4">
                Unsubscribe
              </h1>
              <p className="text-neutral-600 mb-8">
                If you received an email from us and want to unsubscribe, please click the unsubscribe link in that email.
              </p>
              <Link
                href="/"
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                Return to homepage
              </Link>
            </>
          )}
        </div>
      </Container>
    </section>
  );
}
