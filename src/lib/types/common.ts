export type AccountType = "uk_retail" | "uk_retail_joint";

export type AccountOwner = {
  user_id: string;
  preferred_name: string;
  preferred_first_name: string;
};

type TransactionMerchantAddress = {
  short_formatted: string;
  city: string;
  latitude: number;
  longitude: number;
  zoom_level: number;
  approximate: boolean;
  formatted: string;
  address: string;
  region: string;
  country: string;
  postcode: string;
};

export type TransactionMerchant = {
  id: string;
  group_id: string;
  name: string;
  logo: string;
  emoji: string;
  category: string;
  online: boolean;
  atm: boolean;
  address: TransactionMerchantAddress;
  disable_feedback: boolean;
  metadata: Record<string, string>;
};
