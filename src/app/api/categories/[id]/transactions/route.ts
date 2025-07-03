import { and, desc, eq } from "drizzle-orm";

import { withAccount } from "@/lib/api/middleware";
import { MiddlewareResponse } from "@/lib/api/response";
import { db } from "@/lib/db";
import { monzoTransactions } from "@/lib/db/schema/monzo-schema";
import type { Transaction } from "@/lib/types";

export const GET = withAccount<
  Transaction[],
  { params: Promise<{ id: string }> }
>(async ({ context: { params }, accountId }) => {
  const { id: categoryId } = await params;

  const dbTransactions = await db.query.monzoTransactions.findMany({
    columns: {
      accountId: false,
      createdAt: false,
      updatedAt: false,
    },
    with: {
      category: {
        columns: {
          accountId: false,
          createdAt: false,
          updatedAt: false,
        },
      },
      merchant: {
        columns: {
          id: true,
          groupId: true,
          address: true,
          online: true,
        },
        with: {
          group: {
            columns: {
              id: true,
              name: true,
              logo: true,
              emoji: true,
            },
          },
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
        fees: dbTransaction.fees as Record<string, unknown>,
        amount: Number(dbTransaction.amount),
        localAmount: Number(dbTransaction.localAmount),
      };
    }
  );

  return MiddlewareResponse.success(transactions);
});
