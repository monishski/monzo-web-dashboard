export type Transaction = {
  id: string;
  created: string;
  description: string;
  amount: number;
  currency: string;
  notes: string | null;
  category: string | null;
  settled: string | null;
  localAmount: number;
  localCurrency: string;
  merchantId: string | null;
  categoryId: string | null;
};
