CREATE TABLE "monzo_merchant_groups" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"logo" text NOT NULL,
	"emoji" text,
	"disable_feedback" boolean NOT NULL,
	"atm" boolean NOT NULL,
	"metadata" jsonb NOT NULL,
	"monzo_category" text,
	"category_id" text,
	"account_id" text NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
ALTER TABLE "monzo_merchants" DROP CONSTRAINT "monzo_merchants_category_id_monzo_categories_id_fk";
--> statement-breakpoint
ALTER TABLE "monzo_merchant_groups" ADD CONSTRAINT "monzo_merchant_groups_category_id_monzo_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."monzo_categories"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "monzo_merchant_groups" ADD CONSTRAINT "monzo_merchant_groups_account_id_monzo_accounts_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."monzo_accounts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "monzo_merchants" ADD CONSTRAINT "monzo_merchants_group_id_monzo_merchant_groups_id_fk" FOREIGN KEY ("group_id") REFERENCES "public"."monzo_merchant_groups"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "monzo_merchants" DROP COLUMN "name";--> statement-breakpoint
ALTER TABLE "monzo_merchants" DROP COLUMN "logo";--> statement-breakpoint
ALTER TABLE "monzo_merchants" DROP COLUMN "emoji";--> statement-breakpoint
ALTER TABLE "monzo_merchants" DROP COLUMN "category_id";--> statement-breakpoint
ALTER TABLE "monzo_merchants" DROP COLUMN "monzo_category";--> statement-breakpoint
ALTER TABLE "monzo_merchants" DROP COLUMN "atm";--> statement-breakpoint
ALTER TABLE "monzo_merchants" DROP COLUMN "disable_feedback";--> statement-breakpoint
ALTER TABLE "monzo_merchants" DROP COLUMN "metadata";