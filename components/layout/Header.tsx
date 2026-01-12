'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'About', href: '/about' },
  { name: 'Events', href: '/events' },
  { name: 'Focus Areas', href: '/focus-areas' },
  { name: 'Get Involved', href: '/get-involved' },
  { name: 'Contact', href: '/contact' },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-neutral-100 shadow-sm">
      <Container>
        <nav className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <span className="text-xl lg:text-2xl font-display font-bold text-primary-700 group-hover:text-primary-800 transition-colors">
              DC <span className="text-accent-500">Abundance</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex lg:items-center lg:gap-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="relative text-neutral-600 hover:text-primary-700 font-medium transition-colors after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-accent-500 hover:after:w-full after:transition-all after:duration-300"
              >
                {item.name}
              </Link>
            ))}
            <Link
              href="/#newsletter"
              className="bg-gradient-to-b from-accent-400 to-accent-500 hover:from-accent-500 hover:to-accent-600 text-neutral-900 font-semibold px-5 py-2.5 rounded-lg transition-all duration-200 hover:scale-[1.02] hover:shadow-md hover:shadow-accent-500/25"
            >
              Join Us
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            type="button"
            className="lg:hidden p-2 -mr-2 text-neutral-700 relative"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <span className={cn(
              'block transition-all duration-300',
              mobileMenuOpen ? 'rotate-180 scale-90' : 'rotate-0 scale-100'
            )}>
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </span>
          </button>
        </nav>
      </Container>

      {/* Mobile Navigation Overlay */}
      <div
        className={cn(
          'lg:hidden fixed inset-0 top-16 bg-black/20 backdrop-blur-sm transition-opacity duration-300',
          mobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
        )}
        onClick={() => setMobileMenuOpen(false)}
      />

      {/* Mobile Navigation Menu */}
      <div
        className={cn(
          'lg:hidden fixed inset-x-0 top-16 bg-white border-b border-neutral-100 shadow-xl transition-all duration-300 ease-out overflow-hidden',
          mobileMenuOpen ? 'max-h-[400px] opacity-100' : 'max-h-0 opacity-0'
        )}
      >
        <Container className="py-6">
          <div className="flex flex-col gap-1">
            {navigation.map((item, index) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'text-neutral-600 hover:text-primary-700 hover:bg-primary-50 font-medium py-3 px-4 rounded-lg transition-all duration-200',
                  'transform',
                  mobileMenuOpen
                    ? 'translate-x-0 opacity-100'
                    : '-translate-x-4 opacity-0'
                )}
                style={{
                  transitionDelay: mobileMenuOpen ? `${index * 50}ms` : '0ms'
                }}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <Link
              href="/#newsletter"
              className={cn(
                'mt-3 bg-gradient-to-b from-accent-400 to-accent-500 hover:from-accent-500 hover:to-accent-600 text-neutral-900 font-semibold px-5 py-3 rounded-lg text-center transition-all duration-200',
                'transform',
                mobileMenuOpen
                  ? 'translate-x-0 opacity-100'
                  : '-translate-x-4 opacity-0'
              )}
              style={{
                transitionDelay: mobileMenuOpen ? `${navigation.length * 50}ms` : '0ms'
              }}
              onClick={() => setMobileMenuOpen(false)}
            >
              Join Us
            </Link>
          </div>
        </Container>
      </div>
    </header>
  );
}
