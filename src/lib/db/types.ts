import type {
  monzoAccounts,
  monzoCategories,
  monzoMerchants,
  monzoTransactions,
} from "./schema";

export type MonzoDbAccount = typeof monzoAccounts.$inferInsert;
export type MonzoDbTransaction = typeof monzoTransactions.$inferInsert;
export type MonzoDbMerchant = typeof monzoMerchants.$inferInsert;
export type MonzoDbCategory = typeof monzoCategories.$inferInsert;
