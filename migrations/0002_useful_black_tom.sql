CREATE INDEX "idx_registrations_event_status" ON "event_registrations" USING btree ("event_id","status");--> statement-breakpoint
CREATE INDEX "idx_registrations_event_waitlist" ON "event_registrations" USING btree ("event_id","status","waitlist_position");--> statement-breakpoint
ALTER TABLE "event_registrations" ADD CONSTRAINT "unique_event_email" UNIQUE("event_id","email");--> statement-breakpoint
ALTER TABLE "series_registrations" ADD CONSTRAINT "unique_series_email" UNIQUE("series_id","email");