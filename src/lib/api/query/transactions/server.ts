import type { PgColumn } from "drizzle-orm/pg-core";

import {
  monzoCategories,
  monzoMerchantGroups,
  monzoTransactions,
} from "@/lib/db/schema";

import { createApiQuerySchema } from "../utils";
import type {
  TransactionBooleanFilterFields,
  TransactionDateFilterFields,
  TransactionNumericFilterFields,
  TransactionSearchFields,
  TransactionSortFields,
  TransactionStringFilterFields,
} from "./types";

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
