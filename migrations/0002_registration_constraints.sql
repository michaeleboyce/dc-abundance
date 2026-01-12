-- Add unique constraint to prevent duplicate registrations for same event/email
ALTER TABLE "event_registrations" ADD CONSTRAINT "unique_event_email" UNIQUE ("event_id", "email");--> statement-breakpoint
-- Add index for efficient count queries by event and status
CREATE INDEX "idx_registrations_event_status" ON "event_registrations" ("event_id", "status");--> statement-breakpoint
-- Add index for waitlist ordering queries
CREATE INDEX "idx_registrations_event_waitlist" ON "event_registrations" ("event_id", "status", "waitlist_position");
