import Link from 'next/link';
import { Container } from '@/components/ui/Container';

const navigation = {
  main: [
    { name: 'About', href: '/about' },
    { name: 'Focus Areas', href: '/focus-areas' },
    { name: 'Get Involved', href: '/get-involved' },
    { name: 'Contact', href: '/contact' },
  ],
  focus: [
    { name: 'Housing', href: '/focus-areas/housing' },
    { name: 'Transportation', href: '/focus-areas/transportation' },
    { name: 'Energy', href: '/focus-areas/energy' },
    { name: 'Science', href: '/focus-areas/science' },
    { name: 'Government', href: '/focus-areas/government' },
  ],
  legal: [
    { name: 'Image Credits', href: '/credits' },
  ],
};

export function Footer() {
  return (
    <footer className="bg-primary-900 text-white">
      <Container className="py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="text-2xl font-bold text-white">
              DC Abundance
            </Link>
            <p className="mt-4 text-neutral-300 text-sm leading-relaxed">
              Building a more abundant future—more housing, better transportation, clean energy,
              and efficient government for everyone.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="font-semibold text-white mb-4">Navigation</h3>
            <ul className="space-y-3">
              {navigation.main.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-neutral-300 hover:text-white transition-colors text-sm"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Focus Areas */}
          <div>
            <h3 className="font-semibold text-white mb-4">Focus Areas</h3>
            <ul className="space-y-3">
              {navigation.focus.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-neutral-300 hover:text-white transition-colors text-sm"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter CTA */}
          <div>
            <h3 className="font-semibold text-white mb-4">Join the Movement</h3>
            <p className="text-neutral-300 text-sm mb-4">
              Get updates on policy wins, events, and ways to help build a more abundant future.
            </p>
            <Link
              href="/#newsletter"
              className="inline-block bg-gradient-to-b from-accent-400 to-accent-500 hover:from-accent-500 hover:to-accent-600 text-neutral-900 font-semibold px-5 py-2.5 rounded-lg transition-all text-sm hover:shadow-md hover:shadow-accent-500/25"
            >
              Sign Up
            </Link>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-primary-800">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-neutral-400 text-sm">
              &copy; {new Date().getFullYear()} DC Abundance. All rights reserved.
            </p>
            <div className="flex gap-6">
              {navigation.legal.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-neutral-400 hover:text-white transition-colors text-sm"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
}
