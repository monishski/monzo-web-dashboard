ALTER TABLE "monzo_merchants" DROP CONSTRAINT "monzo_merchants_category_monzo_categories_id_fk";
--> statement-breakpoint
ALTER TABLE "monzo_transactions" DROP CONSTRAINT "monzo_transactions_category_monzo_categories_id_fk";
