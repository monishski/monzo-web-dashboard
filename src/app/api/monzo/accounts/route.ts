import { NextResponse } from "next/server";

import { withAuthAccessToken } from "@/lib/api/middleware";
import { db, monzoAccounts } from "@/lib/db";

import { fetchAccounts } from "./endpoints";
import { getDatabaseAccount } from "./utils";

export const POST = withAuthAccessToken<typeof monzoAccounts.$inferInsert>(
  async ({ userId, accessToken }) => {
    const { accounts } = await fetchAccounts(accessToken);
    const retailAccounts = accounts?.filter(
      (account) => account.type === "uk_retail"
    );
    if (!retailAccounts.length)
      throw Error("Unable to find any retail accounts");

    const [insertedAccounts] = await db
      .insert(monzoAccounts)
      .values(
        retailAccounts.map((account) =>
          getDatabaseAccount(account, userId)
        )
      )
      .returning();

    return NextResponse.json({ success: true, data: insertedAccounts });
  }
);
