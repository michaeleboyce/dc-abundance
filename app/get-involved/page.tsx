import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { NewsletterForm } from '@/components/forms/NewsletterForm';
import {
  Mail,
  Users,
  MessageSquare,
  Share2,
  Heart,
  Calendar,
  ArrowRight
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Get Involved',
  description: 'Join the DC Abundance movement. Learn how you can help build a more abundant Washington, DC.',
};

const waysToHelp = [
  {
    icon: Mail,
    title: 'Stay Informed',
    description:
      'Join our newsletter to receive updates on policy developments, events, and opportunities to take action.',
    action: 'newsletter',
  },
  {
    icon: MessageSquare,
    title: 'Contact Your Representatives',
    description:
      'Make your voice heard by contacting your local and federal representatives about housing, transportation, energy, and government reform.',
    action: 'external',
    link: 'https://www.usa.gov/elected-officials',
    linkText: 'Find Your Representatives',
  },
  {
    icon: Share2,
    title: 'Spread the Word',
    description:
      'Share our message with friends, family, and neighbors. The more people who understand the abundance vision, the faster we can build it.',
    action: 'share',
  },
  {
    icon: Users,
    title: 'Attend Events',
    description:
      'Join community meetings, policy forums, and advocacy events. Meet others who share your vision for the region.',
    action: 'contact',
  },
  {
    icon: Heart,
    title: 'Volunteer',
    description:
      "Help with outreach, research, event planning, or communications. We're building a movement and need all hands on deck.",
    action: 'contact',
  },
  {
    icon: Calendar,
    title: 'Testify at Hearings',
    description:
      'Speak at DC Council hearings on housing, zoning, transportation, and other abundance issues. Your voice matters in the legislative process.',
    action: 'contact',
  },
];

export default function GetInvolvedPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative h-[50vh] min-h-[400px] flex items-end">
        <Image
          src="/images/arena-stage.jpg"
          alt="Arena Stage at the Mead Center for American Theater"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
        <Container className="relative z-10 pb-12">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white">
            Get Involved
          </h1>
          <p className="mt-4 text-xl text-neutral-200 max-w-2xl">
            Building abundance takes all of us. Here's how you can help
            create the future we deserve.
          </p>
        </Container>
      </section>

      {/* Newsletter Section */}
      <section id="newsletter" className="py-16 lg:py-24 bg-accent-50">
        <Container>
          <div className="max-w-md mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-neutral-800">
              Join the Movement
            </h2>
            <p className="mt-4 text-lg text-neutral-600">
              Get weekly updates on DC policy, upcoming events, and opportunities
              to make a difference.
            </p>
            <div className="mt-8">
              <NewsletterForm variant="section" />
            </div>
            <p className="mt-6 text-sm text-neutral-500">
              Want to tell us more about yourself?{' '}
              <Link href="/join" className="text-primary-600 hover:text-primary-700 font-medium">
                Complete your full profile
              </Link>
            </p>
          </div>
        </Container>
      </section>

      {/* Ways to Help */}
      <section className="py-16 lg:py-24">
        <Container>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-neutral-800 text-center">
            Ways to Contribute
          </h2>
          <p className="mt-4 text-lg text-neutral-600 text-center max-w-2xl mx-auto">
            Whether you have five minutes or five hours, there's a way for you
            to help build a more abundant future.
          </p>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {waysToHelp.map((way) => {
              const Icon = way.icon;
              return (
                <div
                  key={way.title}
                  className="bg-white border border-neutral-200 rounded-xl p-6 hover:shadow-md transition-shadow"
                >
                  <div className="p-3 bg-primary-100 rounded-lg w-fit">
                    <Icon className="h-6 w-6 text-primary-700" />
                  </div>
                  <h3 className="mt-4 text-xl font-semibold text-neutral-800">
                    {way.title}
                  </h3>
                  <p className="mt-2 text-neutral-600">{way.description}</p>
                  {way.action === 'external' && way.link && (
                    <a
                      href={way.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 inline-flex items-center gap-1 text-primary-600 hover:text-primary-700 font-medium"
                    >
                      {way.linkText}
                      <ArrowRight className="h-4 w-4" />
                    </a>
                  )}
                  {way.action === 'contact' && (
                    <Link
                      href="/contact"
                      className="mt-4 inline-flex items-center gap-1 text-primary-600 hover:text-primary-700 font-medium"
                    >
                      Contact Us
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  )}
                  {way.action === 'newsletter' && (
                    <a
                      href="#newsletter"
                      className="mt-4 inline-flex items-center gap-1 text-primary-600 hover:text-primary-700 font-medium"
                    >
                      Sign Up Below
                      <ArrowRight className="h-4 w-4" />
                    </a>
                  )}
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      {/* Partner Organizations */}
      <section className="py-16 lg:py-24 bg-neutral-50">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-neutral-800">
              Join the Abundance Ecosystem
            </h2>
            <p className="mt-4 text-lg text-neutral-600">
              DC Abundance is part of a broader movement for abundance across the
              country. Connect with these aligned organizations to amplify your
              impact.
            </p>
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
              <a
                href="https://abundancedc.org"
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 bg-white rounded-lg border border-neutral-200 hover:border-primary-300 transition-colors"
              >
                <h3 className="font-semibold text-neutral-800">
                  Abundance 2025
                </h3>
                <p className="mt-1 text-sm text-neutral-600">
                  Annual abundance policy conference in Washington, DC
                </p>
              </a>
              <a
                href="https://abundance.institute"
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 bg-white rounded-lg border border-neutral-200 hover:border-primary-300 transition-colors"
              >
                <h3 className="font-semibold text-neutral-800">
                  Abundance Institute
                </h3>
                <p className="mt-1 text-sm text-neutral-600">
                  Research and advocacy for abundance policies
                </p>
              </a>
              <a
                href="https://recodingamerica.us"
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 bg-white rounded-lg border border-neutral-200 hover:border-primary-300 transition-colors"
              >
                <h3 className="font-semibold text-neutral-800">
                  Recoding America
                </h3>
                <p className="mt-1 text-sm text-neutral-600">
                  Improving government technology and services
                </p>
              </a>
              <a
                href="https://thebreakthrough.org"
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 bg-white rounded-lg border border-neutral-200 hover:border-primary-300 transition-colors"
              >
                <h3 className="font-semibold text-neutral-800">
                  Breakthrough Institute
                </h3>
                <p className="mt-1 text-sm text-neutral-600">
                  Ecomodernism and clean energy research
                </p>
              </a>
            </div>
          </div>
        </Container>
      </section>

      {/* Contact CTA */}
      <section className="py-16 lg:py-24">
        <Container>
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-neutral-800">
              Have Ideas or Questions?
            </h2>
            <p className="mt-4 text-lg text-neutral-600 max-w-2xl mx-auto">
              We'd love to hear from you. Whether you have policy ideas,
              partnership proposals, or just want to say hello, reach out.
            </p>
            <Link
              href="/contact"
              className="mt-8 inline-block bg-primary-700 hover:bg-primary-800 text-white font-medium px-8 py-3 rounded-lg transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </Container>
      </section>
    </>
  );
}
