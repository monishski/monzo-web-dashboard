import { and, count, eq, max } from "drizzle-orm";
import omit from "lodash/omit";

import { withAccount } from "@/lib/api/middleware";
import { MiddlewareResponse } from "@/lib/api/response";
import { db } from "@/lib/db";
import {
  monzoCategories,
  monzoMerchantGroups,
  monzoMerchants,
  monzoTransactions,
} from "@/lib/db/schema/monzo-schema";
import type { MerchantAddress, MerchantGroup } from "@/lib/types";

export const GET = withAccount<
  MerchantGroup,
  { params: Promise<{ id: string }> }
>(async ({ context: { params } }) => {
  const { id: groupId } = await params;

  const [dbMerchantGroup] = await db
    .select()
    .from(monzoMerchantGroups)
    .where(eq(monzoMerchantGroups.id, groupId))
    .limit(1);

  if (!dbMerchantGroup) {
    return MiddlewareResponse.notFound("Merchant group not found");
  }

  const merchants = await db
    .select()
    .from(monzoMerchants)
    .where(eq(monzoMerchants.groupId, groupId));

  let dbCategory = null;
  if (dbMerchantGroup.categoryId) {
    const [category] = await db
      .select()
      .from(monzoCategories)
      .where(eq(monzoCategories.id, dbMerchantGroup.categoryId))
      .limit(1);
    dbCategory = category;
  }

  const [dbTransactions] = await db
    .select({
      transactionsCount: count(monzoTransactions.id),
      lastTransactionDate: max(monzoTransactions.created),
    })
    .from(monzoTransactions)
    .where(
      and(
        eq(monzoTransactions.merchantGroupId, groupId),
        eq(monzoTransactions.accountId, dbMerchantGroup.accountId)
      )
    );

  const merchantGroup: MerchantGroup = {
    ...omit(dbMerchantGroup, ["accountId", "createdAt", "updatedAt"]),
    merchants: merchants.map((merchant) => ({
      ...omit(merchant, ["accountId", "createdAt", "updatedAt"]),
      address: merchant.address as MerchantAddress,
    })),
    category: dbCategory
      ? omit(dbCategory, ["accountId", "createdAt", "updatedAt"])
      : null,
    transactionsCount: dbTransactions.transactionsCount,
    lastTransactionDate: dbTransactions.lastTransactionDate,
  };

  return MiddlewareResponse.success(merchantGroup);
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

  const [dbMerchantGroup] = await db
    .update(monzoMerchantGroups)
    .set({ categoryId })
    .where(eq(monzoMerchantGroups.id, groupId))
    .returning();

  if (!dbMerchantGroup) {
    return MiddlewareResponse.notFound("Merchant group not found");
  }

  const dbMerchants = await db
    .select()
    .from(monzoMerchants)
    .where(eq(monzoMerchants.groupId, groupId));

  let category = null;
  if (dbMerchantGroup.categoryId) {
    const [dbCategory] = await db
      .select({
        id: monzoCategories.id,
        name: monzoCategories.name,
        isMonzo: monzoCategories.isMonzo,
      })
      .from(monzoCategories)
      .where(eq(monzoCategories.id, dbMerchantGroup.categoryId))
      .limit(1);
    category = dbCategory;
  }

  const [dbTransactions] = await db
    .select({
      transactionsCount: count(monzoTransactions.id),
      lastTransactionDate: max(monzoTransactions.created),
    })
    .from(monzoTransactions)
    .where(
      and(
        eq(monzoTransactions.merchantGroupId, groupId),
        eq(monzoTransactions.accountId, dbMerchantGroup.accountId)
      )
    );

  const merchantGroup: MerchantGroup = {
    ...omit(dbMerchantGroup, ["accountId", "createdAt", "updatedAt"]),
    merchants: dbMerchants.map((dbMerchant) => ({
      ...omit(dbMerchant, ["accountId", "createdAt", "updatedAt"]),
      address: dbMerchant.address as MerchantAddress,
    })),
    category,
    transactionsCount: dbTransactions.transactionsCount,
    lastTransactionDate: dbTransactions.lastTransactionDate,
  };

  return MiddlewareResponse.success(merchantGroup);
});
