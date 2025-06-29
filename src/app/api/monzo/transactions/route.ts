import { withAuthAccessToken } from "@/lib/api/middleware";
import { MiddlewareResponse } from "@/lib/api/response";
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
    const { accountId } = await request.json();
    if (!accountId) {
      return MiddlewareResponse.badRequest("Account ID is required");
    }

    const { transactions: _monzoTransactions } = await fetchTransactions(
      accessToken,
      accountId
    );

    if (!_monzoTransactions || _monzoTransactions.length === 0) {
      return MiddlewareResponse.badRequest("No transactions found");
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

    return MiddlewareResponse.created();
  }
);
