import { NextResponse } from "next/server";

import { withAuthAccessToken } from "@/lib/api/middleware";
import { db } from "@/lib/db";
import {
  monzoCategories,
  monzoMerchants,
  monzoTransactions,
} from "@/lib/db/schema/monzo-schema";

import { DEFAULT_CATEGORIES } from "./constants";
import { fetchTransactions } from "./endpoints";
import {
  getDatabaseTransaction,
  getMerchantsAndCategories,
} from "./utils";

export const POST = withAuthAccessToken<
  (typeof monzoTransactions.$inferInsert)[]
>(async ({ request, userId, accessToken }) => {
  // Get the account ID from the request body
  const { accountId } = await request.json();
  if (!accountId) {
    return NextResponse.json(
      { success: false, error: "Account ID is required" },
      { status: 400 }
    );
  }

  const { transactions } = await fetchTransactions(accessToken, accountId);

  if (!transactions || transactions.length === 0) {
    return NextResponse.json({
      success: false,
      error: "No transactions found",
    });
  }

  // Process transactions to extract merchants and categories
  const { merchants, customCategories } = getMerchantsAndCategories({
    transactions,
    userId,
    accountId,
  });

  const insertedTransactions = await db.transaction(async (tx) => {
    // Insert default categories
    await tx.insert(monzoCategories).values(
      DEFAULT_CATEGORIES.map((category) => ({
        ...category,
        isMonzo: true,
        userId,
      }))
    );

    // Insert custom categories
    const customCategoriesArray = Array.from(customCategories.values());
    if (customCategoriesArray.length > 0) {
      await tx.insert(monzoCategories).values(customCategoriesArray);
    }

    // Insert merchants
    const merchantsArray = Array.from(merchants.values());
    if (merchantsArray.length > 0) {
      await tx.insert(monzoMerchants).values(merchantsArray);
    }

    // Insert transactions
    const insertedTransactions = await tx
      .insert(monzoTransactions)
      .values(
        transactions.map((transaction) =>
          getDatabaseTransaction(transaction)
        )
      )
      .returning();

    return insertedTransactions;
  });

  return NextResponse.json({ success: true, data: insertedTransactions });
});
