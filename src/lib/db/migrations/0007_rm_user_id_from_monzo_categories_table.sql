ALTER TABLE "monzo_categories" DROP CONSTRAINT "monzo_categories_user_id_user_id_fk";
--> statement-breakpoint
ALTER TABLE "monzo_categories" ADD COLUMN "account_id" text;--> statement-breakpoint
ALTER TABLE "monzo_categories" ADD CONSTRAINT "monzo_categories_account_id_monzo_accounts_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."monzo_accounts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "monzo_categories" DROP COLUMN "user_id";