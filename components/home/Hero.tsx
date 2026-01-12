import Image from 'next/image';
import { ChevronDown } from 'lucide-react';
import { NewsletterForm } from '@/components/forms/NewsletterForm';

export function Hero() {
  return (
    <section className="relative min-h-screen w-full flex items-center justify-center -mt-16 lg:-mt-20 overflow-hidden">
      {/* Background Image with Enhanced Overlay */}
      <div className="absolute inset-0">
        <Image
          src="/images/union-station.jpg"
          alt="Union Station's grand interior showcasing DC's architectural ambition"
          fill
          priority
          className="object-cover scale-105"
          sizes="100vw"
        />
        {/* Cinematic gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary-900/70 via-primary-900/50 to-primary-900/80" />
        {/* Vignette effect */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)]" />
      </div>

      {/* Gold accent line at top */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-accent-500 to-transparent opacity-60" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center px-4 text-center pt-16 lg:pt-20">
        <h1 className="animate-fade-in-up max-w-4xl text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-bold text-white leading-tight drop-shadow-[0_4px_24px_rgba(0,0,0,0.3)]">
          Build a More{' '}
          <span className="text-accent-400">Abundant</span>{' '}
          DC
        </h1>
        <p className="animate-fade-in-up animation-delay-150 mt-6 max-w-2xl text-lg sm:text-xl md:text-2xl text-white/90 leading-relaxed">
          More housing. Better transportation. Clean energy. Efficient government.
          <br className="hidden sm:block" />
          <span className="text-accent-300">A capital of opportunity for everyone.</span>
        </p>

        {/* Newsletter Form */}
        <div className="animate-fade-in-up animation-delay-300 mt-10 w-full max-w-xl px-4">
          <NewsletterForm variant="hero" />
        </div>

        {/* Social proof */}
        <p className="animate-fade-in animation-delay-500 mt-6 text-white/60 text-sm tracking-wide">
          Join us in building a better future
        </p>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <a href="#mission" aria-label="Scroll to learn more" className="group">
          <ChevronDown className="h-8 w-8 text-white/50 group-hover:text-accent-400 transition-colors duration-300" />
        </a>
      </div>
    </section>
  );
}
