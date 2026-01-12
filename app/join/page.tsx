import type { Metadata } from 'next';
import Image from 'next/image';
import { Container } from '@/components/ui/Container';
import { EnhancedNewsletterForm } from '@/components/forms/EnhancedNewsletterForm';

export const metadata: Metadata = {
  title: 'Join DC Abundance',
  description: 'Join the DC Abundance movement. Help us build a more abundant Washington, DC through better housing, transportation, energy, and governance policies.',
};

export default function JoinPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative h-[40vh] min-h-[320px] flex items-end">
        <Image
          src="/images/dc-skyline.jpg"
          alt="Washington DC skyline"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
        <Container className="relative z-10 pb-10">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-white">
            Join the Movement
          </h1>
          <p className="mt-4 text-xl text-neutral-200 max-w-2xl">
            Help build a more abundant Washington, DC. Tell us about yourself and how you'd like to get involved.
          </p>
        </Container>
      </section>

      {/* Form Section */}
      <section className="py-16 lg:py-24">
        <Container>
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 p-8 md:p-10">
              <EnhancedNewsletterForm source="join_page" />
            </div>
            <p className="mt-6 text-center text-sm text-neutral-500">
              By joining, you'll receive our newsletter with policy updates, event announcements, and opportunities to take action.
              You can unsubscribe at any time.
            </p>
          </div>
        </Container>
      </section>
    </>
  );
}
