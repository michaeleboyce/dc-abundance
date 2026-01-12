import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { Home, Train, Zap, Building2, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Focus Areas',
  description: 'Explore DC Abundance priorities: Housing, Transportation, Energy, Government, and making daily life more affordable.',
};

const focusAreas = [
  {
    name: 'Housing Abundance',
    icon: Home,
    image: '/images/dc-rowhouses.jpg',
    imageAlt: 'DC rowhouses at sunset',
    description:
      'DC needs more homes at every price point. We advocate for zoning reform, streamlined permitting, and policies that make it easier to build housing in every neighborhood.',
    href: '/focus-areas/housing',
    color: 'bg-blue-500',
  },
  {
    name: 'Transportation Abundance',
    icon: Train,
    image: '/images/u-street-metro.jpg',
    imageAlt: 'U Street Metro station',
    description:
      'World-class cities need world-class transportation. We push for more frequent Metro service, better bus networks, and infrastructure that makes it easy to get around without a car.',
    href: '/focus-areas/transportation',
    color: 'bg-green-500',
  },
  {
    name: 'Energy Abundance',
    icon: Zap,
    image: '/images/dulles-airport.jpg',
    imageAlt: 'Dulles Airport at dusk',
    description:
      'Clean energy should be cheap and plentiful. We support streamlined permitting for solar and wind projects, grid modernization, and policies that reduce energy costs.',
    href: '/focus-areas/energy',
    color: 'bg-amber-500',
  },
  {
    name: 'Government That Works',
    icon: Building2,
    image: '/images/library-of-congress.jpg',
    imageAlt: 'Library of Congress interior',
    description:
      'Government should enable progress, not block it. We advocate for faster permitting, well-maintained roads and bridges, responsive services, and agencies that actually deliver for residents.',
    href: '/focus-areas/government',
    color: 'bg-purple-500',
  },
];

export default function FocusAreasPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative py-20 lg:py-28 bg-primary-900">
        <Container>
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white">
              Our Focus Areas
            </h1>
            <p className="mt-6 text-xl text-neutral-200 leading-relaxed">
              Building a more abundant future means more housing, better transportation, clean energy,
              efficient government—and making daily life more affordable for everyone.
            </p>
          </div>
        </Container>
      </section>

      {/* Focus Areas */}
      <section className="py-16 lg:py-24">
        <Container>
          <div className="space-y-16 lg:space-y-24">
            {focusAreas.map((area, index) => {
              const Icon = area.icon;
              const isReversed = index % 2 === 1;

              return (
                <div
                  key={area.name}
                  className={`grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center ${
                    isReversed ? 'lg:grid-flow-dense' : ''
                  }`}
                >
                  <div className={isReversed ? 'lg:col-start-2' : ''}>
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`p-2 rounded-lg ${area.color}`}>
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <h2 className="text-2xl md:text-3xl font-display font-bold text-neutral-800">
                        {area.name}
                      </h2>
                    </div>
                    <p className="text-lg text-neutral-600 leading-relaxed">
                      {area.description}
                    </p>
                    <Link
                      href={area.href}
                      className="mt-6 inline-flex items-center text-primary-600 font-medium hover:text-primary-700"
                    >
                      Learn more about {area.name.toLowerCase()}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </div>
                  <div className={`relative aspect-[16/10] rounded-xl overflow-hidden ${isReversed ? 'lg:col-start-1' : ''}`}>
                    <Image
                      src={area.image}
                      alt={area.imageAlt}
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </Container>
      </section>
    </>
  );
}
