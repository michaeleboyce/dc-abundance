import { Resend } from 'resend';

export const resend = new Resend(process.env.RESEND_API_KEY);

// From email - use a verified domain in production
// In test mode, use onboarding@resend.dev
export const FROM_EMAIL = process.env.RESEND_API_KEY?.startsWith('re_test')
  ? 'DC Abundance <onboarding@resend.dev>'
  : 'DC Abundance <hello@dcabundance.org>';

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
