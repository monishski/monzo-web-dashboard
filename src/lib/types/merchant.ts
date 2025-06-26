import type { Category } from "./category";

type MerchantAddress = {
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

export type Merchant = {
  id: string;
  groupId: string;
  name: string;
  logo: string;
  emoji: string | null;
  monzo_category: string | null;
  online: boolean;
  atm: boolean;
  address: MerchantAddress;
  metadata: Record<string, string>;
  category?: Pick<Category, "id" | "name" | "isMonzo"> | null;
};
