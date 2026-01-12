import type { Metadata } from 'next';
import Image from 'next/image';
import { Container } from '@/components/ui/Container';

export const metadata: Metadata = {
  title: 'About',
  description: 'Learn about DC Abundance and our mission to build a more abundant Washington, DC.',
};

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative py-20 lg:py-28 bg-primary-900">
        <Container>
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white">
              About DC Abundance
            </h1>
            <p className="mt-6 text-xl text-neutral-200 leading-relaxed">
              A cross-partisan coalition working to make Washington, DC more affordable,
              sustainable, and livable for everyone.
            </p>
          </div>
        </Container>
      </section>

      {/* Our Story */}
      <section className="py-16 lg:py-24">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-neutral-800">Our Story</h2>
              <div className="mt-6 space-y-4 text-neutral-600 leading-relaxed">
                <p>
                  DC Abundance grew out of a simple observation: Washington, DC has become
                  increasingly difficult for regular people to afford. Housing costs have
                  skyrocketed. Metro service has declined. Building anything—even clean
                  energy projects—takes years of navigating bureaucracy.
                </p>
                <p>
                  But it doesn't have to be this way. Cities around the world have shown
                  that with the right policies, you can have abundant housing, excellent
                  transportation, clean energy, AND a high quality of life. We believe DC can
                  join them.
                </p>
                <p>
                  We're not about left or right—we're about building a city that works
                  for everyone. Our coalition includes people from across the political
                  spectrum who share a common goal: making DC more abundant.
                </p>
              </div>
            </div>
            <div className="relative aspect-[4/3] rounded-xl overflow-hidden">
              <Image
                src="/images/haupt-garden.jpg"
                alt="Haupt Garden at the Smithsonian"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </Container>
      </section>

      {/* What We Believe */}
      <section className="py-16 lg:py-24 bg-neutral-50">
        <Container>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-neutral-800 text-center">
            What We Believe
          </h2>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'More is Better',
                description:
                  'More housing means lower prices. More transportation options means less traffic. More clean energy means lower bills. Abundance creates opportunity.',
              },
              {
                title: 'Process Matters',
                description:
                  'Good intentions aren\'t enough. We need permitting processes that actually work, regulations that enable rather than block, and government that delivers results.',
              },
              {
                title: 'Everyone Benefits',
                description:
                  'Abundance isn\'t zero-sum. When we build more housing, existing residents benefit from lower prices. When transportation improves, everyone gets around faster.',
              },
            ].map((belief) => (
              <div key={belief.title} className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="text-xl font-semibold text-neutral-800">{belief.title}</h3>
                <p className="mt-3 text-neutral-600 leading-relaxed">{belief.description}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Call to Action */}
      <section className="py-16 lg:py-24">
        <Container>
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-neutral-800">
              Ready to Help Build an Abundant DC?
            </h2>
            <p className="mt-4 text-lg text-neutral-600 max-w-2xl mx-auto">
              Join our newsletter to stay informed about policy developments, upcoming events,
              and ways to get involved.
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
