import type { Metadata } from 'next';
import Image from 'next/image';
import { Container } from '@/components/ui/Container';
import { Zap, Sun, Gauge, FileCheck } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Energy Abundance',
  description: 'Learn about DC Abundance\'s energy policy priorities: clean energy, streamlined permitting, and lower costs.',
};

export default function EnergyPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative h-[50vh] min-h-[400px] flex items-end">
        <Image
          src="/images/dulles-airport.jpg"
          alt="Dulles Airport at dusk"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
        <Container className="relative z-10 pb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-amber-500">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <span className="text-amber-300 font-medium">Focus Area</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white">
            Energy Abundance
          </h1>
          <p className="mt-4 text-xl text-neutral-200 max-w-2xl">
            Clean, cheap, and plentiful energy for DC.
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
                DC has ambitious climate goals: 100% renewable energy by 2032. But getting
                there requires building a lot more clean energy infrastructure—solar panels,
                grid upgrades, EV charging stations.
              </p>
              <p>
                The problem? Permitting and regulations often make these projects harder,
                not easier. We need to remove barriers to clean energy deployment while
                ensuring projects are done right.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* Policy Priorities */}
      <section className="py-16 lg:py-24 bg-neutral-50">
        <Container>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-neutral-800 text-center">
            Our Energy Priorities
          </h2>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Sun,
                title: 'Solar Everywhere',
                description:
                  'Make it easy to put solar on every suitable roof. Streamline permitting and interconnection processes.',
              },
              {
                icon: Gauge,
                title: 'Grid Modernization',
                description:
                  'Upgrade our electrical grid to handle more renewable energy and support electric vehicles.',
              },
              {
                icon: FileCheck,
                title: 'Smart Regulation',
                description:
                  'Regulations that enable clean energy deployment rather than creating bureaucratic obstacles.',
              },
            ].map((priority) => {
              const Icon = priority.icon;
              return (
                <div key={priority.title} className="bg-white p-6 rounded-xl shadow-sm">
                  <Icon className="h-8 w-8 text-amber-500" />
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
              Help Us Build Energy Abundance
            </h2>
            <p className="mt-4 text-lg text-neutral-600 max-w-2xl mx-auto">
              Join our newsletter to stay informed about clean energy developments
              and opportunities to support a greener DC.
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
