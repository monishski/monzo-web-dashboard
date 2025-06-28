import { NextResponse } from "next/server";

import { withAuthAccessToken } from "@/lib/api/middleware";
import { db } from "@/lib/db";
import {
  monzoCategories,
  monzoMerchants,
  monzoTransactions,
} from "@/lib/db/schema/monzo-schema";

import { fetchTransactions } from "./endpoints";
import { getDatabaseData } from "./utils";

export const POST = withAuthAccessToken(
  async ({ request, accessToken }) => {
    // Get the account ID from the request body
    const { accountId } = await request.json();
    if (!accountId) {
      return NextResponse.json(
        { success: false, error: "Account ID is required" },
        { status: 400 }
      );
    }

    const { transactions: _monzoTransactions } = await fetchTransactions(
      accessToken,
      accountId
    );

    if (!_monzoTransactions || _monzoTransactions.length === 0) {
      return NextResponse.json({
        success: false,
        error: "No transactions found",
      });
    }

    // Process transactions to extract merchants and categories
    const { transactions, merchants, categories } = getDatabaseData({
      transactions: _monzoTransactions,
      accountId,
    });

    await db.transaction(async (tx) => {
      // Insert categories
      await tx.insert(monzoCategories).values(categories);

      // Insert merchants
      await tx.insert(monzoMerchants).values(merchants);

      // Insert transactions
      await tx.insert(monzoTransactions).values(transactions).returning();
    });

    return NextResponse.json({ success: true });
  }
);
