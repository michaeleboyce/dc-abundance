import { Hero } from '@/components/home/Hero';
import { Mission } from '@/components/home/Mission';
import { PolicyPillars } from '@/components/home/PolicyPillars';
import { CallToAction } from '@/components/home/CallToAction';

export default function Home() {
  return (
    <>
      <Hero />
      <Mission />
      <PolicyPillars />
      <CallToAction />
    </>
  );
}
