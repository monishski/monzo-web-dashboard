import type { AccountOwner, AccountType } from "./common";

export type Account = {
  id: string;
  created: string;
  type: AccountType;
  owner_type: string;
  is_flex: boolean;
  product_type: string;
  currency: string;
  owners: AccountOwner[];
  account_number: string;
  sort_code: string;
};
