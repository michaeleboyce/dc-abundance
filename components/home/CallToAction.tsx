import Image from 'next/image';
import { Container } from '@/components/ui/Container';
import { NewsletterForm } from '@/components/forms/NewsletterForm';
import { imagePlaceholders } from '@/lib/image-placeholders';

export function CallToAction() {
  return (
    <section id="newsletter" className="relative py-24 lg:py-36 overflow-hidden">
      {/* Background Image with Enhanced Overlay */}
      <div className="absolute inset-0">
        <Image
          src="/images/haupt-garden.jpg"
          alt="Enid A. Haupt Garden at the Smithsonian"
          fill
          className="object-cover scale-105"
          sizes="100vw"
          placeholder="blur"
          blurDataURL={imagePlaceholders.hauptGarden}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900/90 via-primary-900/85 to-primary-800/90" />
        {/* Vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.3)_100%)]" />
      </div>

      {/* Decorative gold lines */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent-500/40 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent-500/40 to-transparent" />

      {/* Content */}
      <Container className="relative z-10">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-white">
            Join the <span className="text-accent-400">Movement</span>
          </h2>
          <p className="mt-6 text-lg text-neutral-200/90 leading-relaxed">
            Sign up for updates on how you can help build a more abundant DC.
            Get news about policy wins, upcoming events, and ways to make your voice heard.
          </p>

          <div className="mt-10 flex justify-center">
            <NewsletterForm variant="section" className="text-left" dark />
          </div>

          <p className="mt-8 text-sm text-neutral-400/80 tracking-wide">
            We respect your privacy. Unsubscribe at any time.
          </p>
        </div>
      </Container>
    </section>
  );
}
