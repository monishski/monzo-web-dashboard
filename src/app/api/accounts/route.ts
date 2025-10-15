import { eq } from "drizzle-orm";

import { MiddlewareResponse, withAuth } from "@/lib/api";
import { db, monzoAccounts } from "@/lib/db";
import type { Account } from "@/lib/types";

export const GET = withAuth<Account>(async ({ userId }) => {
  const [account] = await db
    .select({
      id: monzoAccounts.id,
      created: monzoAccounts.created,
      type: monzoAccounts.type,
      ownerType: monzoAccounts.ownerType,
      isFlex: monzoAccounts.isFlex,
      productType: monzoAccounts.productType,
      currency: monzoAccounts.currency,
      owners: monzoAccounts.owners,
      accountNumber: monzoAccounts.accountNumber,
      sortCode: monzoAccounts.sortCode,
    })
    .from(monzoAccounts)
    .where(eq(monzoAccounts.userId, userId))
    .limit(1);

  if (!account) {
    return MiddlewareResponse.notFound("Account not found");
  }

  return MiddlewareResponse.success(account as Account);
});
