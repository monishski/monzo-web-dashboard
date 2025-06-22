import type { AccountOwner, AccountType } from "./common";

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
