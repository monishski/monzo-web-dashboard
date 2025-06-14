import { relations } from "drizzle-orm";
import {
  boolean,
  jsonb,
  numeric,
  pgTable,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

import { user } from "./auth-schema";

export const monzoCategories = pgTable("monzo_categories", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  isMonzo: boolean("is_monzo").notNull().default(true),
  userId: text("user_id").references(() => user.id, {
    onDelete: "cascade",
  }),
  createdAt: timestamp("created_at")
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: timestamp("updated_at")
    .$defaultFn(() => new Date())
    .notNull(),
});

export const monzoCategoriesRelations = relations(
  monzoCategories,
  ({ many }) => ({
    merchants: many(monzoMerchants),
    transactions: many(monzoTransactions),
  })
);

export const monzoAccounts = pgTable("monzo_accounts", {
  id: text("id").primaryKey(),
  created: timestamp("created").notNull(),
  type: text("type").notNull(),
  ownerType: text("owner_type").notNull(),
  isFlex: boolean("is_flex").notNull(),
  productType: text("product_type").notNull(),
  currency: text("currency").notNull(),
  owners: jsonb("owners").notNull(),
  accountNumber: text("account_number").notNull(),
  sortCode: text("sort_code").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at")
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: timestamp("updated_at")
    .$defaultFn(() => new Date())
    .notNull(),
});

export const monzoMerchants = pgTable("monzo_merchants", {
  id: text("id").primaryKey(),
  groupId: text("group_id").notNull(),
  name: text("name").notNull(),
  logo: text("logo").notNull(),
  emoji: text("emoji"),
  categoryId: text("category_id")
    .notNull()
    .references(() => monzoCategories.id),
  online: boolean("online").notNull(),
  atm: boolean("atm").notNull(),
  address: jsonb("address").notNull(),
  disableFeedback: boolean("disable_feedback").notNull(),
  metadata: jsonb("metadata").notNull(),
  // TODO: Surely this is a general table that doesnt need user id?
  accountId: text("account_id")
    .notNull()
    .references(() => monzoAccounts.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at")
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: timestamp("updated_at")
    .$defaultFn(() => new Date())
    .notNull(),
});

export const monzoMerchantsRelations = relations(
  monzoMerchants,
  ({ one, many }) => ({
    category: one(monzoCategories, {
      fields: [monzoMerchants.categoryId],
      references: [monzoCategories.id],
    }),
    transactions: many(monzoTransactions),
  })
);

export const monzoTransactions = pgTable("monzo_transactions", {
  id: text("id").primaryKey(),
  created: timestamp("created").notNull(),
  description: text("description").notNull(),
  amount: numeric("amount").notNull(),
  currency: text("currency").notNull(),
  notes: text("notes"),
  categoryId: text("category_id")
    .notNull()
    .references(() => monzoCategories.id),
  settled: timestamp("settled"),
  localAmount: numeric("local_amount").notNull(),
  localCurrency: text("local_currency").notNull(),
  accountId: text("account_id")
    .notNull()
    .references(() => monzoAccounts.id, { onDelete: "cascade" }),
  merchantId: text("merchant_id").references(() => monzoMerchants.id),
  createdAt: timestamp("created_at")
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: timestamp("updated_at")
    .$defaultFn(() => new Date())
    .notNull(),
});

export const monzoTransactionsRelations = relations(
  monzoTransactions,
  ({ one }) => ({
    category: one(monzoCategories, {
      fields: [monzoTransactions.categoryId],
      references: [monzoCategories.id],
    }),
    merchant: one(monzoMerchants, {
      fields: [monzoTransactions.merchantId],
      references: [monzoMerchants.id],
    }),
  })
);
