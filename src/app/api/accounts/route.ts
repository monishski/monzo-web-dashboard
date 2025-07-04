import { eq } from "drizzle-orm";

import { withAuth } from "@/lib/api/middleware";
import { MiddlewareResponse } from "@/lib/api/response";
import { db, monzoAccounts } from "@/lib/db";
import type { Account, AccountOwner, AccountType } from "@/lib/types";

export const GET = withAuth<Account>(async ({ userId }) => {
  const dbAccount = await db.query.monzoAccounts.findFirst({
    where: eq(monzoAccounts.userId, userId),
    columns: {
      userId: false,
      createdAt: false,
      updatedAt: false,
    },
  });

  if (!dbAccount) {
    return MiddlewareResponse.notFound("Account not found");
  }

  const account: Account = {
    ...dbAccount,
    created:
      dbAccount.created instanceof Date
        ? dbAccount.created.toISOString()
        : dbAccount.created,
    type: dbAccount.type as AccountType,
    owners: dbAccount.owners as AccountOwner[],
  };

  return MiddlewareResponse.success(account);
});
