import { NextResponse } from "next/server";

import { authServer } from "@/lib/auth/auth-server";
import { db } from "@/lib/db";
import {
  monzoCategories,
  monzoMerchants,
  monzoTransactions,
} from "@/lib/db/schema/monzo-schema";

import { DEFAULT_CATEGORIES, DEFAULT_CATEGORIES_IDS } from "./constants";
import { fetchTransactions } from "./endpoints";
import { getDatabaseMerchant, getDatabaseTransaction } from "./utils";

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const session = await authServer.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      return NextResponse.json(
        { error: "Unauthenticated" },
        { status: 401 }
      );
    }

    const { accessToken } = await authServer.api.getAccessToken({
      body: { providerId: "monzo", userId: session.user.id },
    });

    if (!accessToken) {
      return NextResponse.json(
        { error: "No access token" },
        { status: 401 }
      );
    }

    // Get the account ID from the request body
    const { accountId } = await request.json();
    if (!accountId) {
      return NextResponse.json(
        { error: "Account ID is required" },
        { status: 400 }
      );
    }

    const { transactions } = await fetchTransactions(
      accessToken,
      accountId
    );

    if (!transactions || transactions.length === 0) {
      return NextResponse.json({ transactions: [] });
    }

    // Collect merchants and categories
    const merchantMap = new Map<
      string,
      typeof monzoMerchants.$inferInsert
    >();
    const customCategoriesMap = new Map<
      string,
      typeof monzoCategories.$inferInsert
    >();

    for (const transaction of transactions) {
      const { merchant, category } = transaction;

      if (
        !DEFAULT_CATEGORIES_IDS.includes(category) &&
        !!category &&
        !customCategoriesMap.has(category)
      ) {
        customCategoriesMap.set(category, {
          id: category,
          name: category,
          isMonzo: true,
          userId: session.user.id,
        });
      }

      if (!!merchant && !merchantMap.has(merchant.id)) {
        merchantMap.set(
          merchant.id,
          getDatabaseMerchant(merchant, accountId)
        );
      }
    }

    const insertedTransactions = await db.transaction(async (tx) => {
      // Insert default categories
      await tx.insert(monzoCategories).values(
        DEFAULT_CATEGORIES.map((category) => ({
          id: category.id,
          name: category.name,
          isMonzo: true,
          userId: session.user.id,
        }))
      );

      // Insert custom categories
      const customCategories = Array.from(customCategoriesMap.values());
      if (customCategories.length > 0) {
        await tx.insert(monzoCategories).values(customCategories);
      }

      // Insert merchants
      const merchants = Array.from(merchantMap.values());
      if (merchants.length > 0) {
        await tx.insert(monzoMerchants).values(merchants);
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

    return NextResponse.json({ transactions: insertedTransactions });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "An unexpected error occurred";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
