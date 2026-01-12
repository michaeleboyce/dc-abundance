import { Container } from '@/components/ui/Container';

export function Mission() {
  return (
    <section id="mission" className="py-20 lg:py-32 bg-neutral-50 relative overflow-hidden">
      {/* Subtle decorative element */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-16 bg-gradient-to-b from-transparent via-accent-500/30 to-transparent" />

      <Container>
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-neutral-800 gold-underline">
            What is Abundance?
          </h2>
          <div className="mt-12 space-y-6 text-lg md:text-xl text-neutral-600 leading-relaxed">
            <p>
              Abundance is the belief that we can build more of what people need—more housing,
              better infrastructure, cleaner energy, faster medical breakthroughs—without
              sacrificing quality of life or environmental protection. It&apos;s about removing
              the barriers that make everything too expensive, too slow, and too hard.
            </p>
            <p className="text-neutral-700 border-l-4 border-accent-500 pl-6 py-2 text-left italic bg-accent-50/50 rounded-r-lg">
              &ldquo;In our nation&apos;s capital, that means tackling challenges that affect everyone:
              the cost of housing, childcare, and healthcare. The state of our roads, bridges,
              and public facilities. The pace of scientific research and getting new medicines
              approved. A government that actually delivers. These aren&apos;t partisan issues—they&apos;re
              about making progress for everyone.&rdquo;
            </p>
            <p>
              <strong className="text-primary-700 font-semibold">DC Abundance</strong> is a cross-partisan
              coalition of residents, advocates, and policymakers who believe we can
              do better. We support technology and research that improves lives, and practical
              policy solutions—both local and federal—that expand opportunity and make our
              capital more affordable, prosperous, and livable for everyone.
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
