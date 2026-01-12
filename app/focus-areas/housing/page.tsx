import type { Metadata } from 'next';
import Image from 'next/image';
import { Container } from '@/components/ui/Container';
import { Home, TrendingUp, MapPin, FileCheck } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Housing Abundance',
  description: 'Housing policy priorities: more homes, zoning reform, and affordable housing for all income levels.',
};

export default function HousingPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative h-[50vh] min-h-[400px] flex items-end">
        <Image
          src="/images/dc-rowhouses.jpg"
          alt="Historic DC rowhouses at sunset"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
        <Container className="relative z-10 pb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-blue-500">
              <Home className="h-6 w-6 text-white" />
            </div>
            <span className="text-blue-300 font-medium">Focus Area</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white">
            Housing Abundance
          </h1>
          <p className="mt-4 text-xl text-neutral-200 max-w-2xl">
            More homes in every neighborhood. Lower costs for everyone.
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
                Our region has a housing crisis. The average renter spends 45% of their
                income on housing—far above the 30% threshold considered affordable. Home
                prices have doubled in the past decade, pushing working families out.
              </p>
              <p>
                The root cause? We simply don&apos;t have enough homes. Restrictive zoning,
                lengthy permitting processes, and opposition to new development have made
                it nearly impossible to build the housing our communities need.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* Policy Priorities */}
      <section className="py-16 lg:py-24 bg-neutral-50">
        <Container>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-neutral-800 text-center">
            Our Housing Priorities
          </h2>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: MapPin,
                title: 'Zoning Reform',
                description:
                  'Allow more housing types in more neighborhoods. End single-family-only zoning and let neighborhoods evolve naturally.',
              },
              {
                icon: FileCheck,
                title: 'Faster Permitting',
                description:
                  'Streamline the approval process for new housing. Clear timelines, digital submissions, and sensible review processes.',
              },
              {
                icon: TrendingUp,
                title: 'Affordability Through Supply',
                description:
                  'Build enough housing to bring costs down. More supply at all price points means more choices for everyone.',
              },
            ].map((priority) => {
              const Icon = priority.icon;
              return (
                <div key={priority.title} className="bg-white p-6 rounded-xl shadow-sm">
                  <Icon className="h-8 w-8 text-blue-500" />
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
              Help Us Build Housing Abundance
            </h2>
            <p className="mt-4 text-lg text-neutral-600 max-w-2xl mx-auto">
              Join our newsletter to stay informed about housing policy developments
              and opportunities to advocate for more homes.
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
