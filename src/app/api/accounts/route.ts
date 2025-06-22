import { NextResponse } from "next/server";
import { eq, getTableColumns } from "drizzle-orm";
import { omit } from "lodash";

import { withAuth } from "@/lib/api/middleware";
import { db } from "@/lib/db";
import { monzoAccounts } from "@/lib/db/schema/monzo-schema";
import type {
  Account,
  AccountOwner,
  AccountType,
} from "@/lib/types/account";

export const GET = withAuth<Account>(async ({ userId }) => {
  const columns = getTableColumns(monzoAccounts);
  const fields = omit(columns, ["userId", "createdAt", "updatedAt"]);

  const [dbAccount] = await db
    .select(fields)
    .from(monzoAccounts)
    .where(eq(monzoAccounts.userId, userId));

  const account: Account = {
    ...dbAccount,
    created:
      dbAccount.created instanceof Date
        ? dbAccount.created.toISOString()
        : dbAccount.created,
    type: dbAccount.type as AccountType,
    owners: dbAccount.owners as AccountOwner[],
  };

  return NextResponse.json({ success: true, data: account });
});
