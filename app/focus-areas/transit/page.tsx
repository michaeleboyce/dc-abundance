import type { Metadata } from 'next';
import Image from 'next/image';
import { Container } from '@/components/ui/Container';
import { Train, Clock, Bus, Bike } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Transit Abundance',
  description: 'Learn about DC Abundance\'s transit policy priorities: frequent Metro service, better buses, and multimodal transportation.',
};

export default function TransitPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative h-[50vh] min-h-[400px] flex items-end">
        <Image
          src="/images/u-street-metro.jpg"
          alt="U Street Metro station interior"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
        <Container className="relative z-10 pb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-green-500">
              <Train className="h-6 w-6 text-white" />
            </div>
            <span className="text-green-300 font-medium">Focus Area</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white">
            Transit Abundance
          </h1>
          <p className="mt-4 text-xl text-neutral-200 max-w-2xl">
            World-class transit for a world-class city.
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
                Metro ridership has declined significantly from pre-pandemic levels. Service
                cuts, reliability issues, and safety concerns have pushed riders away.
                Meanwhile, traffic congestion has returned to—and exceeded—2019 levels.
              </p>
              <p>
                DC deserves transit that matches its ambitions: frequent, reliable, and
                comfortable service that makes not owning a car the easy choice.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* Policy Priorities */}
      <section className="py-16 lg:py-24 bg-neutral-50">
        <Container>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-neutral-800 text-center">
            Our Transit Priorities
          </h2>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Clock,
                title: 'Frequent Service',
                description:
                  'Trains every 5 minutes during peak hours. No schedules to check—just show up and go.',
              },
              {
                icon: Bus,
                title: 'Better Buses',
                description:
                  'More bus lanes, signal priority, and all-door boarding. Make the bus a first-class option.',
              },
              {
                icon: Bike,
                title: 'Complete Network',
                description:
                  'Protected bike lanes, better sidewalks, and seamless connections between all modes.',
              },
            ].map((priority) => {
              const Icon = priority.icon;
              return (
                <div key={priority.title} className="bg-white p-6 rounded-xl shadow-sm">
                  <Icon className="h-8 w-8 text-green-500" />
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
              Help Us Build Transit Abundance
            </h2>
            <p className="mt-4 text-lg text-neutral-600 max-w-2xl mx-auto">
              Join our newsletter to stay informed about transit developments
              and opportunities to advocate for better service.
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
