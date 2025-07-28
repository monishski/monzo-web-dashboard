import { and, eq } from "drizzle-orm";

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

  const dbTransaction = await db
    .select()
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

  if (!dbTransaction || dbTransaction.length === 0) {
    return MiddlewareResponse.notFound("Transaction not found");
  }

  const {
    monzo_transactions,
    monzo_categories,
    monzo_merchants,
    monzo_merchant_groups,
  } = dbTransaction[0];

  const transaction: Transaction = {
    ...monzo_transactions,
    created:
      monzo_transactions.created instanceof Date
        ? monzo_transactions.created.toISOString()
        : monzo_transactions.created,
    settled:
      monzo_transactions.settled instanceof Date
        ? monzo_transactions.settled.toISOString()
        : monzo_transactions.settled,
    fees: monzo_transactions.fees as Record<string, unknown>,
    amount: Number(monzo_transactions.amount),
    localAmount: Number(monzo_transactions.localAmount),
    merchant: monzo_merchants
      ? {
          id: monzo_merchants.id,
          groupId: monzo_merchants.groupId,
          online: monzo_merchants.online,
          address: monzo_merchants.address as MerchantAddress,
        }
      : null,
    category: monzo_categories
      ? {
          id: monzo_categories.id,
          name: monzo_categories.name,
          isMonzo: monzo_categories.isMonzo,
        }
      : null,
    merchantGroup: monzo_merchant_groups
      ? {
          id: monzo_merchant_groups.id,
          name: monzo_merchant_groups.name,
          logo: monzo_merchant_groups.logo,
          emoji: monzo_merchant_groups.emoji,
        }
      : null,
  };

  return MiddlewareResponse.success(transaction);
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

  const [dbTransaction] = await db
    .update(monzoTransactions)
    .set({ categoryId })
    .where(eq(monzoTransactions.id, transactionId))
    .returning();

  if (!dbTransaction) {
    return MiddlewareResponse.notFound("Transaction not found");
  }

  const {
    createdAt: _createdAt,
    updatedAt: _updatedAt,
    ...rest
  } = dbTransaction;

  const transaction: Transaction = {
    ...rest,
    created:
      dbTransaction.created instanceof Date
        ? dbTransaction.created.toISOString()
        : dbTransaction.created,
    settled:
      dbTransaction.settled instanceof Date
        ? dbTransaction.settled.toISOString()
        : null,
    amount: Number(dbTransaction.amount),
    localAmount: Number(dbTransaction.localAmount),
    fees: dbTransaction.fees as Record<string, unknown>,
  };

  return MiddlewareResponse.success(transaction);
});
