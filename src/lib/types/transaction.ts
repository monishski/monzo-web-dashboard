import type { Category } from "./category";
import type { Merchant, MerchantGroup } from "./merchant";

export type Transaction = {
  id: string;
  created: string;
  description: string;
  amount: number;
  currency: string;
  fees: Record<string, unknown>;
  notes: string | null;
  monzo_category: string | null;
  settled: string | null;
  localAmount: number;
  localCurrency: string;
  merchantId: string | null;
  categoryId: string | null;
  merchant?:
    | (Pick<Merchant, "id" | "groupId"> & {
        group: Pick<MerchantGroup, "id" | "name" | "logo" | "emoji">;
      })
    | null;
  category?: Pick<Category, "id" | "name" | "isMonzo"> | null;
};
