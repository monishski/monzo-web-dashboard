CREATE TABLE "monzo_accounts" (
	"id" text PRIMARY KEY NOT NULL,
	"created" timestamp NOT NULL,
	"type" text NOT NULL,
	"owner_type" text NOT NULL,
	"is_flex" boolean NOT NULL,
	"product_type" text NOT NULL,
	"currency" text NOT NULL,
	"owners" jsonb NOT NULL,
	"account_number" text NOT NULL,
	"sort_code" text NOT NULL,
	"user_id" text NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "monzo_merchants" (
	"id" text PRIMARY KEY NOT NULL,
	"group_id" text NOT NULL,
	"name" text NOT NULL,
	"logo" text NOT NULL,
	"emoji" text,
	"category" text NOT NULL,
	"online" boolean NOT NULL,
	"atm" boolean NOT NULL,
	"address" jsonb NOT NULL,
	"disable_feedback" boolean NOT NULL,
	"metadata" jsonb NOT NULL,
	"account_id" text NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "monzo_transactions" (
	"id" text PRIMARY KEY NOT NULL,
	"created" timestamp NOT NULL,
	"description" text NOT NULL,
	"amount" numeric NOT NULL,
	"currency" text NOT NULL,
	"notes" text,
	"category" text NOT NULL,
	"settled" timestamp,
	"local_amount" numeric NOT NULL,
	"local_currency" text NOT NULL,
	"account_id" text NOT NULL,
	"merchant_id" text,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
ALTER TABLE "monzo_accounts" ADD CONSTRAINT "monzo_accounts_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "monzo_merchants" ADD CONSTRAINT "monzo_merchants_account_id_monzo_accounts_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."monzo_accounts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "monzo_transactions" ADD CONSTRAINT "monzo_transactions_account_id_monzo_accounts_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."monzo_accounts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "monzo_transactions" ADD CONSTRAINT "monzo_transactions_merchant_id_monzo_merchants_id_fk" FOREIGN KEY ("merchant_id") REFERENCES "public"."monzo_merchants"("id") ON DELETE no action ON UPDATE no action;