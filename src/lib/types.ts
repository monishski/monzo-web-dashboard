export type AccountType = "uk_retail" | "uk_retail_joint";

export type AccountOwner = {
  user_id: string;
  preferred_name: string;
  preferred_first_name: string;
};

export type Account = {
  id: string;
  created: string;
  type: AccountType;
  ownerType: string;
  isFlex: boolean;
  productType: string;
  currency: string;
  owners: AccountOwner[];
  accountNumber: string;
  sortCode: string;
};

export type Category = {
  id: string;
  name: string;
  isMonzo: boolean;
  createdAt: string;
  updatedAt: string;
};

export type MerchantAddress = {
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
  category?: Pick<Category, "id" | "name" | "isMonzo"> | null;
  merchants?: Merchant[];
  transactions?: Transaction[];
};

export type Merchant = {
  id: string;
  groupId: string;
  online: boolean;
  address: MerchantAddress;
  group?: MerchantGroup;
};

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
  merchant?: Merchant | null;
  category?: Pick<Category, "id" | "name" | "isMonzo"> | null;
  merchantGroup?: Pick<
    MerchantGroup,
    "id" | "name" | "logo" | "emoji"
  > | null;
};
