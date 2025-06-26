import type { Category } from "./category";
import type { Merchant } from "./merchant";

export type Transaction = {
  id: string;
  created: string;
  description: string;
  amount: number;
  currency: string;
  notes: string | null;
  monzo_category: string | null;
  settled: string | null;
  localAmount: number;
  localCurrency: string;
  merchantId: string | null;
  categoryId: string | null;
  merchant?: Pick<Merchant, "id" | "groupId" | "name" | "logo"> | null;
  category?: Pick<Category, "id" | "name" | "isMonzo"> | null;
};
