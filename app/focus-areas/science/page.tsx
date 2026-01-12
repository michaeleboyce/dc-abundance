import type { Metadata } from 'next';
import Image from 'next/image';
import { Container } from '@/components/ui/Container';
import { Microscope, FlaskConical, Pill, Lightbulb, Rocket } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Science & Innovation',
  description: 'Science and innovation priorities: scientific research, faster drug approvals, medical breakthroughs, and technology that improves lives.',
};

export default function SciencePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative h-[50vh] min-h-[400px] flex items-end">
        <Image
          src="/images/goddard-space-center.jpg"
          alt="NASA Goddard Space Flight Center aerial view"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
        <Container className="relative z-10 pb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-indigo-500">
              <Microscope className="h-6 w-6 text-white" />
            </div>
            <span className="text-indigo-300 font-medium">Focus Area</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white">
            Science & Innovation
          </h1>
          <p className="mt-4 text-xl text-neutral-200 max-w-2xl">
            Accelerating research, enabling breakthroughs, and getting life-saving treatments to people faster.
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
                The Washington region is home to world-class research institutions—NIH, NASA Goddard,
                leading universities, and countless biotech companies. Yet too often, promising
                discoveries take decades to reach the people who need them.
              </p>
              <p>
                Drug approvals take too long. Regulatory processes designed for a different era
                slow down innovation. We have the talent and the science—we need systems that
                help breakthroughs happen faster, not slower.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* Policy Priorities */}
      <section className="py-16 lg:py-24 bg-neutral-50">
        <Container>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-neutral-800 text-center">
            Our Science & Innovation Priorities
          </h2>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: FlaskConical,
                title: 'Support Research',
                description:
                  'Fund basic and applied research that creates breakthroughs in medicine, energy, and technology. Invest in the science that solves tomorrow\'s problems.',
              },
              {
                icon: Pill,
                title: 'Faster Drug Approvals',
                description:
                  'Modernize FDA processes so promising treatments reach patients faster without sacrificing safety. Accelerate cures, not bureaucracy.',
              },
              {
                icon: Lightbulb,
                title: 'Enable Innovation',
                description:
                  'Remove regulatory barriers that slow down beneficial technologies. Make it easier to test, develop, and deploy new solutions.',
              },
              {
                icon: Rocket,
                title: 'Commercialize Discoveries',
                description:
                  'Help research move from the lab to the real world. Support technology transfer and startup formation around federal research.',
              },
              {
                icon: Microscope,
                title: 'Attract Talent',
                description:
                  'Make it easier for the world\'s best scientists and researchers to work here. Streamline visa processes for high-skilled immigrants.',
              },
            ].map((priority) => {
              const Icon = priority.icon;
              return (
                <div key={priority.title} className="bg-white p-6 rounded-xl shadow-sm">
                  <Icon className="h-8 w-8 text-indigo-500" />
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
              Help Us Accelerate Progress
            </h2>
            <p className="mt-4 text-lg text-neutral-600 max-w-2xl mx-auto">
              Join our newsletter to stay informed about science policy developments
              and opportunities to support innovation.
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
