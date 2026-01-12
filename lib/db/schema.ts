import { pgTable, serial, text, timestamp, boolean, pgEnum, integer, uuid } from 'drizzle-orm/pg-core';

// Enum for contact form inquiry types
export const inquiryTypeEnum = pgEnum('inquiry_type', [
  'general',
  'housing',
  'transit',
  'energy',
  'government',
  'partnership',
  'media',
  'volunteer'
]);

// Newsletter subscribers table
export const newsletterSubscribers = pgTable('newsletter_subscribers', {
  id: serial('id').primaryKey(),
  email: text('email').notNull().unique(),
  firstName: text('first_name'),
  lastName: text('last_name'),
  zipCode: text('zip_code'),
  isActive: boolean('is_active').notNull().default(true),
  subscribedAt: timestamp('subscribed_at', { withTimezone: true }).notNull().defaultNow(),
  unsubscribedAt: timestamp('unsubscribed_at', { withTimezone: true }),
  unsubscribeToken: uuid('unsubscribe_token').notNull().defaultRandom().unique(),
});

// Contact form submissions table
export const contactSubmissions = pgTable('contact_submissions', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  inquiryType: inquiryTypeEnum('inquiry_type').notNull().default('general'),
  subject: text('subject').notNull(),
  message: text('message').notNull(),
  isRead: boolean('is_read').notNull().default(false),
  isArchived: boolean('is_archived').notNull().default(false),
  submittedAt: timestamp('submitted_at', { withTimezone: true }).notNull().defaultNow(),
});

// Event status enum
export const eventStatusEnum = pgEnum('event_status', ['draft', 'published', 'cancelled']);

// Registration status enum
export const registrationStatusEnum = pgEnum('registration_status', ['confirmed', 'waitlisted', 'cancelled']);

// Events table
export const events = pgTable('events', {
  id: serial('id').primaryKey(),
  slug: text('slug').notNull().unique(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  shortDescription: text('short_description'),
  eventDate: timestamp('event_date', { withTimezone: true }).notNull(),
  location: text('location').notNull(),
  locationAddress: text('location_address'),
  maxAttendees: integer('max_attendees').notNull(),
  status: eventStatusEnum('status').notNull().default('draft'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

// Event registrations table
export const eventRegistrations = pgTable('event_registrations', {
  id: serial('id').primaryKey(),
  eventId: integer('event_id').notNull().references(() => events.id, { onDelete: 'cascade' }),
  email: text('email').notNull(),
  firstName: text('first_name').notNull(),
  lastName: text('last_name'),
  status: registrationStatusEnum('status').notNull(),
  confirmationToken: uuid('confirmation_token').notNull().defaultRandom().unique(),
  registeredAt: timestamp('registered_at', { withTimezone: true }).notNull().defaultNow(),
  cancelledAt: timestamp('cancelled_at', { withTimezone: true }),
  waitlistPosition: integer('waitlist_position'),
});

// Type exports for type-safe queries
export type NewsletterSubscriber = typeof newsletterSubscribers.$inferSelect;
export type NewNewsletterSubscriber = typeof newsletterSubscribers.$inferInsert;

export type ContactSubmission = typeof contactSubmissions.$inferSelect;
export type NewContactSubmission = typeof contactSubmissions.$inferInsert;

export type Event = typeof events.$inferSelect;
export type NewEvent = typeof events.$inferInsert;

export type EventRegistration = typeof eventRegistrations.$inferSelect;
export type NewEventRegistration = typeof eventRegistrations.$inferInsert;
