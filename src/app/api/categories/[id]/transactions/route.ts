import { NextResponse } from "next/server";
import { and, desc, eq } from "drizzle-orm";

import { withAuth } from "@/lib/api/middleware";
import { db } from "@/lib/db";
import { monzoTransactions } from "@/lib/db/schema/monzo-schema";
import type { Transaction } from "@/lib/types";

// NOTE: this is a POST request even though we are fetching because of the request body
export const POST = withAuth<
  Transaction[],
  { params: Promise<{ id: string }> }
>(async ({ request, context: { params } }) => {
  const { id: categoryId } = await params;
  const body = await request.json();
  const { accountId } = body;

  const dbTransactions = await db.query.monzoTransactions.findMany({
    columns: {
      accountId: false,
      createdAt: false,
      updatedAt: false,
    },
    with: {
      _category: {
        columns: {
          userId: false,
          createdAt: false,
          updatedAt: false,
        },
      },
      merchant: {
        columns: {
          id: true,
          groupId: true,
          emoji: true,
          name: true,
          logo: true,
        },
      },
    },
    where: and(
      eq(monzoTransactions.categoryId, categoryId),
      eq(monzoTransactions.accountId, accountId)
    ),
    orderBy: desc(monzoTransactions.created),
  });

  const transactions: Transaction[] = dbTransactions.map(
    (dbTransaction) => {
      return {
        ...dbTransaction,
        created:
          dbTransaction.created instanceof Date
            ? dbTransaction.created.toISOString()
            : dbTransaction.created,
        settled:
          dbTransaction.settled instanceof Date
            ? dbTransaction.settled.toISOString()
            : dbTransaction.settled,
        amount: Number(dbTransaction.amount),
        localAmount: Number(dbTransaction.localAmount),
      };
    }
  );

  return NextResponse.json({ success: true, data: transactions });
});
