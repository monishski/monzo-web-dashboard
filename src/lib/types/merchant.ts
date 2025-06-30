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

export type MerchantGroup = {
  id: string;
  name: string;
  logo: string;
  emoji: string | null;
  disableFeedback: boolean;
  atm: boolean;
  monzo_category: string | null;
  categoryId: string | null;
  category?: Pick<Category, "id" | "name" | "isMonzo"> | null;
  merchant?: Merchant[];
};

export type Merchant = {
  id: string;
  groupId: string;
  online: boolean;
  address: MerchantAddress;
  group?: MerchantGroup;
};
