import type { Metadata } from 'next';
import Image from 'next/image';
import { Container } from '@/components/ui/Container';
import { Building2, Clock, Smartphone, Users } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Government That Works',
  description: 'Learn about DC Abundance\'s government reform priorities: efficient permitting, digital services, and responsive government.',
};

export default function GovernmentPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative h-[50vh] min-h-[400px] flex items-end">
        <Image
          src="/images/library-of-congress.jpg"
          alt="Library of Congress interior"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
        <Container className="relative z-10 pb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-purple-500">
              <Building2 className="h-6 w-6 text-white" />
            </div>
            <span className="text-purple-300 font-medium">Focus Area</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white">
            Government That Works
          </h1>
          <p className="mt-4 text-xl text-neutral-200 max-w-2xl">
            Efficient, responsive, and transparent government for DC.
          </p>
        </Container>
      </section>

      {/* The Problem */}
      <section className="py-16 lg:py-24">
        <Container>
          <div className="max-w-3xl">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-neutral-800">The Challenge</h2>
            <div className="mt-6 space-y-4 text-lg text-neutral-600 leading-relaxed">
              <p>
                Getting anything done in DC often means navigating a maze of agencies,
                permits, and approvals. Simple projects take months or years. Citizens
                struggle to access basic services. Good intentions get lost in bureaucracy.
              </p>
              <p>
                Government should enable progress, not block it. We need processes designed
                around the people who use them, not the agencies that run them.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* Policy Priorities */}
      <section className="py-16 lg:py-24 bg-neutral-50">
        <Container>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-neutral-800 text-center">
            Our Government Priorities
          </h2>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Clock,
                title: 'Faster Permitting',
                description:
                  'Clear timelines, automatic approvals for routine requests, and accountability when deadlines are missed.',
              },
              {
                icon: Smartphone,
                title: 'Digital-First Services',
                description:
                  'Modern, user-friendly online services. No more waiting in line or navigating confusing forms.',
              },
              {
                icon: Users,
                title: 'Responsive Government',
                description:
                  'Government that listens to residents and adapts to their needs. Transparent processes and clear communication.',
              },
            ].map((priority) => {
              const Icon = priority.icon;
              return (
                <div key={priority.title} className="bg-white p-6 rounded-xl shadow-sm">
                  <Icon className="h-8 w-8 text-purple-500" />
                  <h3 className="mt-4 text-xl font-semibold text-neutral-800">
                    {priority.title}
                  </h3>
                  <p className="mt-3 text-neutral-600 leading-relaxed">
                    {priority.description}
                  </p>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      {/* Call to Action */}
      <section className="py-16 lg:py-24">
        <Container>
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-neutral-800">
              Help Us Build Better Government
            </h2>
            <p className="mt-4 text-lg text-neutral-600 max-w-2xl mx-auto">
              Join our newsletter to stay informed about government reform efforts
              and opportunities to advocate for change.
            </p>
            <a
              href="/#newsletter"
              className="mt-8 inline-block bg-accent-500 hover:bg-accent-600 text-neutral-900 font-medium px-8 py-3 rounded-lg transition-colors"
            >
              Join the Movement
            </a>
          </div>
        </Container>
      </section>
    </>
  );
}
