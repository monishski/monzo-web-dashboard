ALTER TABLE "user" ADD COLUMN "user_id" text;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "client_id" text;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "client_ip" text;--> statement-breakpoint
ALTER TABLE "user" ADD CONSTRAINT "user_user_id_unique" UNIQUE("user_id");