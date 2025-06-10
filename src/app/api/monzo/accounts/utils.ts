import type { monzoAccounts } from "@/lib/db";

import type { MonzoAccount } from "./types";

export function getDatabaseAccount(
  account: MonzoAccount,
  userId: string
): typeof monzoAccounts.$inferInsert {
  const {
    created,
    owner_type,
    is_flex,
    product_type,
    account_number,
    sort_code,
    ...other
  } = account;

  return {
    ...other,
    created: new Date(created),
    ownerType: owner_type,
    isFlex: is_flex,
    productType: product_type,
    accountNumber: account_number,
    sortCode: sort_code,
    userId,
  };
}
