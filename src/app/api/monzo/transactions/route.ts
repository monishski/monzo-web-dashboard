import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

import { authServer } from "@/lib/auth/auth-server";
import { db } from "@/lib/db";
import {
  monzoMerchants,
  monzoTransactions,
} from "@/lib/db/schema/monzo-schema";

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

    const insertedTransactions = await db.transaction(async (tx) => {
      await tx
        .delete(monzoTransactions)
        .where(eq(monzoTransactions.accountId, accountId));

      // Handle merchants first
      const merchantMap = new Map<string, string>();

      for (const transaction of transactions) {
        const { merchant } = transaction;

        if (merchant && !merchantMap.has(merchant.id)) {
          const existingMerchant = await tx
            .select()
            .from(monzoMerchants)
            .where(eq(monzoMerchants.id, merchant.id))
            .limit(1);

          if (existingMerchant.length === 0) {
            const [insertedMerchant] = await tx
              .insert(monzoMerchants)
              .values(
                getDatabaseMerchant(merchant, transaction.account_id)
              )
              .returning({ id: monzoMerchants.id });

            merchantMap.set(merchant.id, insertedMerchant.id);
          } else {
            merchantMap.set(merchant.id, existingMerchant[0].id);
          }
        }
      }

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

    return NextResponse.json({
      transactions: insertedTransactions,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "An unexpected error occurred";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
