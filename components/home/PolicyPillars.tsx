import Image from 'next/image';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { Home, Train, Zap, Building2, ArrowRight } from 'lucide-react';

const pillars = [
  {
    name: 'Housing',
    icon: Home,
    image: '/images/dc-rowhouses.jpg',
    imageAlt: 'Historic DC rowhouses at sunset in Logan Circle',
    description: 'More homes in every neighborhood. End exclusionary zoning. Build housing for all income levels.',
    href: '/focus-areas/housing',
    stats: '45%',
    statsLabel: 'of income spent on rent by average DC renter',
  },
  {
    name: 'Transportation',
    icon: Train,
    image: '/images/u-street-metro.jpg',
    imageAlt: 'U Street Metro station interior',
    description: 'World-class public transportation. Frequent, reliable Metro service. Better buses and bike infrastructure.',
    href: '/focus-areas/transportation',
    stats: '40%',
    statsLabel: 'of Metro riders rely on public transportation',
  },
  {
    name: 'Energy',
    icon: Zap,
    image: '/images/dulles-airport.jpg',
    imageAlt: 'Dulles Airport at dusk representing modern infrastructure',
    description: 'Clean, cheap, plentiful energy. Solar on every suitable roof. Streamlined permitting for green projects.',
    href: '/focus-areas/energy',
    stats: '100%',
    statsLabel: 'renewable energy target for DC by 2032',
  },
  {
    name: 'Government',
    icon: Building2,
    image: '/images/library-of-congress.jpg',
    imageAlt: 'Library of Congress interior representing government institutions',
    description: 'Efficient permitting. Responsive services. Transparent processes. A government that enables progress.',
    href: '/focus-areas/government',
    stats: '18mo',
    statsLabel: 'average time to approve a construction permit',
  },
];

export function PolicyPillars() {
  return (
    <section className="py-20 lg:py-32 bg-white relative">
      {/* Decorative top border */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-neutral-200 to-transparent" />

      <Container>
        <div className="text-center mb-16 lg:mb-20">
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-neutral-800">
            Our Focus Areas
          </h2>
          <p className="mt-4 text-lg text-neutral-500 max-w-2xl mx-auto">
            Four pillars for building a more abundant DC
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {pillars.map((pillar, index) => {
            const Icon = pillar.icon;
            return (
              <Link
                key={pillar.name}
                href={pillar.href}
                className="group bg-white rounded-2xl overflow-hidden border border-neutral-100 shadow-sm hover:shadow-xl hover:border-accent-200 transition-all duration-500 hover:-translate-y-2"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Image */}
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={pillar.image}
                    alt={pillar.imageAlt}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary-900/80 via-primary-900/20 to-transparent" />
                  <div className="absolute bottom-4 left-4 flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-accent-500/90 backdrop-blur-sm">
                      <Icon className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-white font-semibold text-lg">{pillar.name}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <p className="text-neutral-600 text-sm leading-relaxed">
                    {pillar.description}
                  </p>

                  {/* Stats */}
                  <div className="mt-5 pt-5 border-t border-neutral-100">
                    <p className="text-3xl font-display font-bold text-primary-700">{pillar.stats}</p>
                    <p className="text-xs text-neutral-500 mt-1">{pillar.statsLabel}</p>
                  </div>

                  {/* Learn more */}
                  <div className="mt-5 flex items-center text-primary-600 text-sm font-medium group-hover:text-accent-600 transition-colors">
                    Learn more
                    <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-2 transition-transform duration-300" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
