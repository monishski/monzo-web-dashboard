import type { PgColumn } from "drizzle-orm/pg-core";

import {
  monzoCategories,
  monzoMerchantGroups,
  monzoTransactions,
} from "@/lib/db/schema";
import type { Transaction } from "@/lib/types";

import type { ApiQuery } from "./types";
import { createApiQuerySchema } from "./utils";

export type TransactionSortFields = keyof Pick<
  Transaction,
  | "description"
  | "created"
  | "amount"
  | "localAmount"
  | "category"
  | "merchantGroup"
>;
export type TransactionSearchFields = keyof Pick<
  Transaction,
  "description" | "category" | "merchantGroup"
>;
export type TransactionNumericFilterFields = keyof Pick<
  Transaction,
  "amount" | "localAmount"
>;
export type TransactionDateFilterFields = keyof Pick<
  Transaction,
  "created" | "settled"
>;
export type TransactionBooleanFilterFields = never;
export type TransactionStringFilterFields = keyof Pick<
  Transaction,
  "category" | "merchantGroup"
>;

export type TransactionApiQuery = ApiQuery<
  TransactionSortFields[],
  TransactionSearchFields[],
  TransactionNumericFilterFields[],
  TransactionDateFilterFields[],
  TransactionBooleanFilterFields[],
  TransactionStringFilterFields[]
>;

export const TransactionsApiQuerySchema = createApiQuerySchema<
  TransactionSortFields[],
  TransactionSearchFields[],
  TransactionNumericFilterFields[],
  TransactionDateFilterFields[],
  TransactionStringFilterFields[],
  TransactionBooleanFilterFields[]
>({
  sort: [
    "description",
    "created",
    "amount",
    "localAmount",
    "category",
    "merchantGroup",
  ],
  search: ["description", "category", "merchantGroup"],
  filters: {
    numeric: ["amount", "localAmount"],
    date: ["created", "settled"],
    string: ["category", "merchantGroup"],
  },
});

export const transactionsSortFieldMap: Record<
  TransactionSortFields,
  PgColumn
> = {
  description: monzoTransactions.description,
  created: monzoTransactions.created,
  amount: monzoTransactions.amount,
  localAmount: monzoTransactions.localAmount,
  category: monzoCategories.name,
  merchantGroup: monzoMerchantGroups.name,
};

export const transactionsSearchFieldMap: Record<
  TransactionSearchFields,
  PgColumn
> = {
  description: monzoTransactions.description,
  category: monzoCategories.name,
  merchantGroup: monzoMerchantGroups.name,
};

export const transactionsStringFilterFieldMap: Record<
  TransactionStringFilterFields,
  PgColumn
> = {
  category: monzoTransactions.categoryId,
  merchantGroup: monzoTransactions.merchantGroupId,
};
