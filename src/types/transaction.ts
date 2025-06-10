import type { TransactionCategory, TransactionMerchant } from "./common";

export type Transaction = {
  id: string;
  created: string;
  description: string;
  amount: number;
  fees: unknown;
  currency: string;
  notes: string;
  category: TransactionCategory;
  settled: string;
  local_amount: string;
  local_currency: string;
  account_id: string;
  merchant: TransactionMerchant;
};
