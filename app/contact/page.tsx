import type { Metadata } from 'next';
import { Container } from '@/components/ui/Container';
import { ContactForm } from '@/components/forms/ContactForm';
import { Mail, MapPin } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Get in touch with DC Abundance. We\'d love to hear from you.',
};

export default function ContactPage() {
  return (
    <>
      {/* Hero */}
      <section className="py-16 lg:py-24 bg-primary-900">
        <Container>
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white">
              Get in Touch
            </h1>
            <p className="mt-6 text-xl text-neutral-200 leading-relaxed">
              Have a question, idea, or want to get involved? We'd love to hear from you.
            </p>
          </div>
        </Container>
      </section>

      {/* Contact Form & Info */}
      <section className="py-16 lg:py-24">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
            {/* Form */}
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold text-neutral-800 mb-6">
                Send Us a Message
              </h2>
              <ContactForm />
            </div>

            {/* Contact Info */}
            <div>
              <h2 className="text-2xl font-bold text-neutral-800 mb-6">
                Other Ways to Reach Us
              </h2>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <Mail className="h-6 w-6 text-primary-600 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-neutral-800">Email</h3>
                    <a
                      href="mailto:hello@dcabundance.org"
                      className="text-primary-600 hover:text-primary-700"
                    >
                      hello@dcabundance.org
                    </a>
                  </div>
                </div>
                <div className="flex gap-4">
                  <MapPin className="h-6 w-6 text-primary-600 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-neutral-800">Location</h3>
                    <p className="text-neutral-600">
                      Washington, DC
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-12 p-6 bg-neutral-50 rounded-xl">
                <h3 className="font-semibold text-neutral-800">
                  Interested in Partnering?
                </h3>
                <p className="mt-2 text-neutral-600 text-sm">
                  If you represent an organization interested in collaborating with
                  DC Abundance, please mention it in your message and select
                  "Partnership" as the inquiry type.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
