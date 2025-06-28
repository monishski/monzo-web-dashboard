import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

import { withAuth } from "@/lib/api/middleware";
import { db } from "@/lib/db";
import { monzoAccounts } from "@/lib/db/schema/monzo-schema";
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
    return NextResponse.json(
      { success: false, error: "Account not found" },
      { status: 404 }
    );
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

  return NextResponse.json({ success: true, data: account });
});
