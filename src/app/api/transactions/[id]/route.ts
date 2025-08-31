import { and, eq } from "drizzle-orm";
import omit from "lodash/omit";

import { withAccount } from "@/lib/api/middleware";
import { MiddlewareResponse } from "@/lib/api/response";
import {
  db,
  monzoCategories,
  monzoMerchantGroups,
  monzoMerchants,
  monzoTransactions,
} from "@/lib/db";
import type { MerchantAddress, Transaction } from "@/lib/types";

export const GET = withAccount<
  Transaction,
  { params: Promise<{ id: string }> }
>(async ({ context: { params }, accountId }) => {
  const { id: transactionId } = await params;

  const [dbTransaction] = await db
    .select({
      transaction: monzoTransactions,
      category: {
        id: monzoCategories.id,
        name: monzoCategories.name,
        isMonzo: monzoCategories.isMonzo,
      },
      merchant: {
        id: monzoMerchants.id,
        groupId: monzoMerchants.groupId,
        online: monzoMerchants.online,
        address: monzoMerchants.address,
      },
      merchantGroup: {
        id: monzoMerchantGroups.id,
        name: monzoMerchantGroups.name,
        logo: monzoMerchantGroups.logo,
        emoji: monzoMerchantGroups.emoji,
      },
    })
    .from(monzoTransactions)
    .leftJoin(
      monzoCategories,
      eq(monzoTransactions.categoryId, monzoCategories.id)
    )
    .leftJoin(
      monzoMerchants,
      eq(monzoTransactions.merchantId, monzoMerchants.id)
    )
    .leftJoin(
      monzoMerchantGroups,
      eq(monzoTransactions.merchantGroupId, monzoMerchantGroups.id)
    )
    .where(
      and(
        eq(monzoTransactions.id, transactionId),
        eq(monzoTransactions.accountId, accountId)
      )
    )
    .limit(1);

  if (!dbTransaction) {
    return MiddlewareResponse.notFound("Transaction not found");
  }

  return MiddlewareResponse.success({
    ...omit(dbTransaction.transaction, [
      "accountId",
      "createdAt",
      "updatedAt",
    ]),
    fees: dbTransaction.transaction.fees as Record<string, unknown>,
    amount: Number(dbTransaction.transaction.amount),
    localAmount: Number(dbTransaction.transaction.localAmount),
    merchant: dbTransaction.merchant
      ? {
          ...dbTransaction.merchant,
          address: dbTransaction.merchant.address as MerchantAddress,
        }
      : null,
    category: dbTransaction.category,
    merchantGroup: dbTransaction.merchantGroup,
  });
});

export const PUT = withAccount<
  Transaction,
  { params: Promise<{ id: string }> }
>(async ({ request, context: { params }, accountId: _accountId }) => {
  const { id: transactionId } = await params;

  const body = await request.json();
  const { categoryId } = body;

  if (!categoryId) {
    return MiddlewareResponse.badRequest("Category ID is required");
  }

  const [updatedTransaction] = await db
    .update(monzoTransactions)
    .set({ categoryId })
    .where(eq(monzoTransactions.id, transactionId))
    .returning();

  if (!updatedTransaction) {
    return MiddlewareResponse.notFound("Transaction not found");
  }

  const [dbTransaction] = await db
    .select({
      transaction: monzoTransactions,
      category: {
        id: monzoCategories.id,
        name: monzoCategories.name,
        isMonzo: monzoCategories.isMonzo,
      },
      merchant: {
        id: monzoMerchants.id,
        groupId: monzoMerchants.groupId,
        online: monzoMerchants.online,
        address: monzoMerchants.address,
      },
      merchantGroup: {
        id: monzoMerchantGroups.id,
        name: monzoMerchantGroups.name,
        logo: monzoMerchantGroups.logo,
        emoji: monzoMerchantGroups.emoji,
      },
    })
    .from(monzoTransactions)
    .leftJoin(
      monzoCategories,
      eq(monzoTransactions.categoryId, monzoCategories.id)
    )
    .leftJoin(
      monzoMerchants,
      eq(monzoTransactions.merchantId, monzoMerchants.id)
    )
    .leftJoin(
      monzoMerchantGroups,
      eq(monzoTransactions.merchantGroupId, monzoMerchantGroups.id)
    )
    .where(
      and(
        eq(monzoTransactions.id, transactionId),
        eq(monzoTransactions.accountId, _accountId)
      )
    )
    .limit(1);

  return MiddlewareResponse.success({
    ...omit(dbTransaction.transaction, [
      "accountId",
      "createdAt",
      "updatedAt",
    ]),
    fees: dbTransaction.transaction.fees as Record<string, unknown>,
    amount: Number(dbTransaction.transaction.amount),
    localAmount: Number(dbTransaction.transaction.localAmount),
    merchant: dbTransaction.merchant
      ? {
          ...dbTransaction.merchant,
          address: dbTransaction.merchant.address as MerchantAddress,
        }
      : null,
    category: dbTransaction.category,
    merchantGroup: dbTransaction.merchantGroup,
  });
});
