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
