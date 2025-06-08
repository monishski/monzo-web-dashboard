import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

import { auth } from "@/lib/auth/auth";
import { db } from "@/lib/db";
import { monzoMerchants, monzoTransactions } from "@/lib/db/schema/monzo-schema";

import { fetchTransactions } from "./endpoints";

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
    }

    const { accessToken } = await auth.api.getAccessToken({
      body: { providerId: "monzo", userId: session.user.id },
    });

    if (!accessToken) {
      return NextResponse.json({ error: "No access token" }, { status: 401 });
    }

    // Get the account ID from the request body
    const { accountId } = await request.json();
    if (!accountId) {
      return NextResponse.json({ error: "Account ID is required" }, { status: 400 });
    }

    const { transactions } = await fetchTransactions(accessToken, accountId);

    const insertedTransactions = await db.transaction(async (tx) => {
      await tx.delete(monzoTransactions).where(eq(monzoTransactions.accountId, accountId));

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
              .values({
                id: merchant.id,
                groupId: merchant.group_id,
                name: merchant.name,
                logo: merchant.logo,
                emoji: merchant.emoji,
                category: merchant.category,
                online: merchant.online,
                atm: merchant.atm,
                address: merchant.address,
                disableFeedback: merchant.disable_feedback,
                metadata: merchant.metadata,
                accountId: transaction.account_id,
              })
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
          transactions.map((transaction) => ({
            id: transaction.id,
            created: new Date(transaction.created),
            description: transaction.description,
            // TODO: ?Drizzle ORM expects these values as strings to maintain precision?
            amount: transaction.amount.toString(),
            currency: transaction.currency,
            notes: transaction.notes,
            category: transaction.category,
            settled: transaction.settled ? new Date(transaction.settled) : null,
            localAmount: transaction.local_amount.toString(),
            localCurrency: transaction.local_currency,
            accountId: transaction.account_id,
            merchantId: transaction.merchant ? merchantMap.get(transaction.merchant.id) : undefined,
          }))
        )
        .returning();

      return insertedTransactions;
    });

    return NextResponse.json({
      transactions: insertedTransactions,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "An unexpected error occurred";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
