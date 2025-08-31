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

  const [_transaction] = await db
    .select({
      transaction: {
        id: monzoTransactions.id,
        created: monzoTransactions.created,
        description: monzoTransactions.description,
        amount: monzoTransactions.amount,
        currency: monzoTransactions.currency,
        fees: monzoTransactions.fees,
        notes: monzoTransactions.notes,
        monzo_category: monzoTransactions.monzo_category,
        settled: monzoTransactions.settled,
        localAmount: monzoTransactions.localAmount,
        localCurrency: monzoTransactions.localCurrency,
      },
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

  if (!_transaction) {
    return MiddlewareResponse.notFound("Transaction not found");
  }

  return MiddlewareResponse.success({
    ..._transaction.transaction,
    fees: _transaction.transaction.fees as Record<string, unknown>,
    amount: Number(_transaction.transaction.amount),
    localAmount: Number(_transaction.transaction.localAmount),
    merchant: _transaction.merchant && {
      ..._transaction.merchant,
      address: _transaction.merchant.address as MerchantAddress,
    },
    category: _transaction.category,
    merchantGroup: _transaction.merchantGroup,
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

  const [_transaction] = await db
    .select({
      transaction: {
        id: monzoTransactions.id,
        created: monzoTransactions.created,
        description: monzoTransactions.description,
        amount: monzoTransactions.amount,
        currency: monzoTransactions.currency,
        fees: monzoTransactions.fees,
        notes: monzoTransactions.notes,
        monzo_category: monzoTransactions.monzo_category,
        settled: monzoTransactions.settled,
        localAmount: monzoTransactions.localAmount,
        localCurrency: monzoTransactions.localCurrency,
      },
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
    ..._transaction.transaction,
    fees: _transaction.transaction.fees as Record<string, unknown>,
    amount: Number(_transaction.transaction.amount),
    localAmount: Number(_transaction.transaction.localAmount),
    merchant: _transaction.merchant && {
      ..._transaction.merchant,
      address: _transaction.merchant.address as MerchantAddress,
    },
    category: _transaction.category,
    merchantGroup: _transaction.merchantGroup,
  });
});
