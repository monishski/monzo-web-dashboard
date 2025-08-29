import { eq } from "drizzle-orm";
import omit from "lodash/omit";

import { withAuth } from "@/lib/api/middleware";
import { MiddlewareResponse } from "@/lib/api/response";
import { db, monzoAccounts } from "@/lib/db";
import type { Account, AccountOwner, AccountType } from "@/lib/types";

export const GET = withAuth<Account>(async ({ userId }) => {
  const [account] = await db
    .select()
    .from(monzoAccounts)
    .where(eq(monzoAccounts.userId, userId))
    .limit(1);

  if (!account) {
    return MiddlewareResponse.notFound("Account not found");
  }

  return MiddlewareResponse.success({
    ...omit(account, ["userId", "createdAt", "updatedAt"]),
    type: account.type as AccountType,
    owners: account.owners as AccountOwner[],
  });
});
