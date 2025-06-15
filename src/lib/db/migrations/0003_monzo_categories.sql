CREATE TABLE "monzo_categories" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"is_monzo" boolean DEFAULT true NOT NULL,
	"user_id" text,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
ALTER TABLE "monzo_merchants" RENAME COLUMN "category" TO "category_id";--> statement-breakpoint
ALTER TABLE "monzo_transactions" RENAME COLUMN "category" TO "category_id";--> statement-breakpoint
ALTER TABLE "monzo_categories" ADD CONSTRAINT "monzo_categories_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "monzo_merchants" ADD CONSTRAINT "monzo_merchants_category_id_monzo_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."monzo_categories"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "monzo_transactions" ADD CONSTRAINT "monzo_transactions_category_id_monzo_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."monzo_categories"("id") ON DELETE no action ON UPDATE no action;