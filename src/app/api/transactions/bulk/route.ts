import { and, eq, gte, lte } from "drizzle-orm";
import * as z from "zod";

import { MiddlewareResponse, withAccount } from "@/lib/api";
import { BulkUpdateTransactionScope } from "@/lib/api/types/response";
import { db, monzoMerchantGroups, monzoTransactions } from "@/lib/db";

const BulkUpdateTransactionsSchema = z.object({
  transactionId: z.string(),
  categoryId: z.string(),
  scope: z.enum([
    BulkUpdateTransactionScope.ALL,
    BulkUpdateTransactionScope.PAST,
    BulkUpdateTransactionScope.FUTURE,
  ]),
});

export const POST = withAccount(async ({ accountId, request }) => {
  const body = await request.json();

  const { transactionId, categoryId, scope } =
    BulkUpdateTransactionsSchema.parse(body);

  const [transaction] = await db
    .select()
    .from(monzoTransactions)
    .where(
      and(
        eq(monzoTransactions.id, transactionId),
        eq(monzoTransactions.accountId, accountId)
      )
    )
    .limit(1);

  if (!transaction.merchantGroupId) {
    return MiddlewareResponse.badRequest(
      "Not possible to bulk update transactions without a merchant"
    );
  }

  if (scope === BulkUpdateTransactionScope.ALL) {
    await db
      .update(monzoTransactions)
      .set({ categoryId })
      .where(
        and(
          eq(
            monzoTransactions.merchantGroupId,
            transaction.merchantGroupId
          ),
          eq(monzoTransactions.accountId, accountId)
        )
      );

    await db
      .update(monzoMerchantGroups)
      .set({ categoryId })
      .where(eq(monzoMerchantGroups.id, transaction.merchantGroupId));

    return MiddlewareResponse.success(
      "Updated all transactions and merchant category"
    );
  } else if (scope === BulkUpdateTransactionScope.PAST) {
    await db
      .update(monzoTransactions)
      .set({ categoryId })
      .where(
        and(
          eq(
            monzoTransactions.merchantGroupId,
            transaction.merchantGroupId
          ),
          eq(monzoTransactions.accountId, accountId),
          lte(monzoTransactions.created, transaction.created)
        )
      );

    return MiddlewareResponse.success(
      "Updated all past transactions category"
    );
  } else {
    await db
      .update(monzoTransactions)
      .set({ categoryId })
      .where(
        and(
          eq(
            monzoTransactions.merchantGroupId,
            transaction.merchantGroupId
          ),
          eq(monzoTransactions.accountId, accountId),
          gte(monzoTransactions.created, transaction.created)
        )
      );

    await db
      .update(monzoMerchantGroups)
      .set({ categoryId })
      .where(eq(monzoMerchantGroups.id, transaction.merchantGroupId));

    return MiddlewareResponse.success(
      "Updated all future transactions category"
    );
  }
});
