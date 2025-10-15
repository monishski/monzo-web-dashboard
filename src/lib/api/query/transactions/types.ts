import type { Transaction } from "@/lib/types";

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
