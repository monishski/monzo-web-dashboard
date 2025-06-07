import type { TransactionCategory } from "./common";

type TransactionMerchantAddress = {
  city: string;
  latitude: string;
  longitude: string;
  approximate: boolean;
  formatted: string;
  address: string;
  region: string;
  country: string;
  postcode: string;
};

type TransactionMerchant = {
  id: string;
  group_id: string;
  name: string;
  logo: string;
  category: TransactionCategory;
  online: boolean;
  atm: boolean;
  metadata: Record<string, string>;
  address: TransactionMerchantAddress;
};

export type Transaction = {
  id: string;
  created: string;
  description: string;
  amount: string;
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
