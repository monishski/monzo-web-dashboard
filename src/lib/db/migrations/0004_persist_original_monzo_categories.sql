ALTER TABLE "monzo_categories" ALTER COLUMN "is_monzo" SET DEFAULT false;--> statement-breakpoint
ALTER TABLE "monzo_merchants" ALTER COLUMN "category_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "monzo_transactions" ALTER COLUMN "category_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "monzo_merchants" ADD COLUMN "category" text;--> statement-breakpoint
ALTER TABLE "monzo_transactions" ADD COLUMN "category" text;--> statement-breakpoint
ALTER TABLE "monzo_merchants" ADD CONSTRAINT "monzo_merchants_category_monzo_categories_id_fk" FOREIGN KEY ("category") REFERENCES "public"."monzo_categories"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "monzo_transactions" ADD CONSTRAINT "monzo_transactions_category_monzo_categories_id_fk" FOREIGN KEY ("category") REFERENCES "public"."monzo_categories"("id") ON DELETE no action ON UPDATE no action;