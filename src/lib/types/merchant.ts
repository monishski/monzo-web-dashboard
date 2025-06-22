import type { Category } from "./category";

type TransactionMerchantAddress = {
  shortFormatted: string;
  city: string;
  latitude: number;
  longitude: number;
  zoomLevel: number;
  approximate: boolean;
  formatted: string;
  address: string;
  region: string;
  country: string;
  postcode: string;
};

export type TransactionMerchant = {
  id: string;
  groupId: string;
  name: string;
  logo: string;
  emoji: string | null;
  category: string | null;
  online: boolean;
  atm: boolean;
  address: TransactionMerchantAddress;
  metadata: Record<string, string>;
  _category?: Pick<Category, "id" | "name" | "isMonzo"> | null;
};
