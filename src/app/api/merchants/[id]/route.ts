import { and, count, eq, max, sql } from "drizzle-orm";

import { MiddlewareResponse, withAccount } from "@/lib/api";
import { db } from "@/lib/db";
import {
  monzoCategories,
  monzoMerchantGroups,
  monzoMerchants,
  monzoTransactions,
} from "@/lib/db/schema/monzo-schema";
import type {
  Merchant,
  MerchantAddress,
  MerchantGroup,
} from "@/lib/types";

export const GET = withAccount<
  MerchantGroup,
  { params: Promise<{ id: string }> }
>(async ({ context: { params } }) => {
  const { id: groupId } = await params;

  const [_merchantGroup] = await db
    .select({
      merchantGroup: {
        id: monzoMerchantGroups.id,
        name: monzoMerchantGroups.name,
        logo: monzoMerchantGroups.logo,
        emoji: monzoMerchantGroups.emoji,
        disableFeedback: monzoMerchantGroups.disableFeedback,
        atm: monzoMerchantGroups.atm,
        monzo_category: monzoMerchantGroups.monzo_category,
      },
      category: {
        id: monzoCategories.id,
        name: monzoCategories.name,
        isMonzo: monzoCategories.isMonzo,
      },
      merchants: sql<Merchant[]>`(
            SELECT COALESCE(
              json_agg(
                CASE 
                  WHEN m.id IS NOT NULL 
                  THEN json_build_object(
                    'id', m.id,
                    'groupId', m.group_id,
                    'online', m.online,
                    'address', m.address
                  )
                  ELSE NULL
                END
              ) FILTER (WHERE m.id IS NOT NULL),
              '[]'::json
            )
            FROM ${monzoMerchants} m
            WHERE m.group_id = ${monzoMerchantGroups.id}
          )`,
      transactionsCount: count(monzoTransactions.id),
      lastTransactionDate: max(monzoTransactions.created),
    })
    .from(monzoMerchantGroups)
    .leftJoin(
      monzoCategories,
      eq(monzoMerchantGroups.categoryId, monzoCategories.id)
    )
    .leftJoin(
      monzoTransactions,
      and(
        eq(monzoTransactions.merchantGroupId, monzoMerchantGroups.id),
        eq(monzoTransactions.accountId, monzoMerchantGroups.accountId)
      )
    )
    .where(eq(monzoMerchantGroups.id, groupId))
    .groupBy(monzoMerchantGroups.id, monzoCategories.id)
    .limit(1);

  if (!_merchantGroup) {
    return MiddlewareResponse.notFound("Merchant group not found");
  }

  return MiddlewareResponse.success({
    ..._merchantGroup.merchantGroup,
    merchants: _merchantGroup.merchants.map((merchant) => ({
      ...merchant,
      address: merchant.address as MerchantAddress,
    })),
    category: _merchantGroup.category,
    transactionsCount: _merchantGroup.transactionsCount,
    lastTransactionDate: _merchantGroup.lastTransactionDate,
  });
});

export const PUT = withAccount<
  MerchantGroup,
  { params: Promise<{ id: string }> }
>(async ({ request, context: { params }, accountId: _accountId }) => {
  const { id: groupId } = await params;
  const body = await request.json();
  const { categoryId } = body;

  if (!categoryId) {
    return MiddlewareResponse.badRequest("Category is required");
  }

  // First update the merchant group
  const [updatedMerchantGroup] = await db
    .update(monzoMerchantGroups)
    .set({ categoryId })
    .where(eq(monzoMerchantGroups.id, groupId))
    .returning();

  if (!updatedMerchantGroup) {
    return MiddlewareResponse.notFound("Merchant group not found");
  }

  const [_merchantGroup] = await db
    .select({
      merchantGroup: {
        id: monzoMerchantGroups.id,
        name: monzoMerchantGroups.name,
        logo: monzoMerchantGroups.logo,
        emoji: monzoMerchantGroups.emoji,
        disableFeedback: monzoMerchantGroups.disableFeedback,
        atm: monzoMerchantGroups.atm,
        monzo_category: monzoMerchantGroups.monzo_category,
      },
      category: {
        id: monzoCategories.id,
        name: monzoCategories.name,
        isMonzo: monzoCategories.isMonzo,
      },
      merchants: sql<Merchant[]>`(
            SELECT COALESCE(
              json_agg(
                CASE 
                  WHEN m.id IS NOT NULL 
                  THEN json_build_object(
                    'id', m.id,
                    'groupId', m.group_id,
                    'online', m.online,
                    'address', m.address
                  )
                  ELSE NULL
                END
              ) FILTER (WHERE m.id IS NOT NULL),
              '[]'::json
            )
            FROM ${monzoMerchants} m
            WHERE m.group_id = ${monzoMerchantGroups.id}
          )`,
      transactionsCount: count(monzoTransactions.id),
      lastTransactionDate: max(monzoTransactions.created),
    })
    .from(monzoMerchantGroups)
    .leftJoin(
      monzoCategories,
      eq(monzoMerchantGroups.categoryId, monzoCategories.id)
    )
    .leftJoin(
      monzoTransactions,
      and(
        eq(monzoTransactions.merchantGroupId, monzoMerchantGroups.id),
        eq(monzoTransactions.accountId, monzoMerchantGroups.accountId)
      )
    )
    .where(eq(monzoMerchantGroups.id, groupId))
    .groupBy(monzoMerchantGroups.id, monzoCategories.id)
    .limit(1);

  return MiddlewareResponse.success({
    ..._merchantGroup.merchantGroup,
    merchants: _merchantGroup.merchants.map((merchant) => ({
      ...merchant,
      address: merchant.address as MerchantAddress,
    })),
    category: _merchantGroup.category,
    transactionsCount: _merchantGroup.transactionsCount,
    lastTransactionDate: _merchantGroup.lastTransactionDate,
  });
});
