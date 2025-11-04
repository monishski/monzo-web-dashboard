import { desc, eq } from "drizzle-orm";

import { MiddlewareResponse, withAuthAccessToken } from "@/lib/api";
import type {
  MonzoDbCategory,
  MonzoDbMerchant,
  MonzoDbMerchantGroup,
  MonzoDbTransaction,
} from "@/lib/db";
import { db } from "@/lib/db";
import {
  monzoCategories,
  monzoMerchantGroups,
  monzoMerchants,
  monzoTransactions,
} from "@/lib/db/schema/monzo-schema";
import { fetchMonzoTransactions, MonzoApiError } from "@/lib/http/monzo";
import type { MonzoTransaction } from "@/lib/http/types";

function getSyncDatabaseData({
  newTransactions,
  accountId,
  currMerchantGroups,
  currCategories,
  currMerchants,
}: {
  newTransactions: MonzoTransaction[];
  accountId: string;
  currMerchantGroups: { id: string; categoryId: string | null }[];
  currCategories: { id: string }[];
  currMerchants: { id: string }[];
}): {
  transactions: MonzoDbTransaction[];
  merchants: MonzoDbMerchant[];
  merchantGroups: MonzoDbMerchantGroup[];
  categories: MonzoDbCategory[];
} {
  const currCategoryIds = new Set(currCategories.map(({ id }) => id));
  const currMerchantIds = new Set(currMerchants.map(({ id }) => id));
  const currMerchantGroupIds = new Set(
    currMerchantGroups.map(({ id }) => id)
  );
  const currMerchantGroupCategoryIds = new Map(
    currMerchantGroups.map(({ id, categoryId }) => [id, categoryId])
  );

  const dbTransactions = [] as MonzoDbTransaction[];
  const dbMerchantsMap = new Map<string, MonzoDbMerchant>();
  const dbMerchantGroupsMap = new Map<string, MonzoDbMerchantGroup>();
  const dbCategoriesMap = new Map<string, MonzoDbCategory>();

  for (const newTransaction of newTransactions) {
    const { merchant, category } = newTransaction;

    // Check if category for merchant already exists
    let categoryId = newTransaction.category || null;

    if (merchant && currMerchantGroupCategoryIds.has(merchant.group_id)) {
      const currMerchantGroupCategoryId = currMerchantGroupCategoryIds.get(
        merchant.group_id
      );
      if (currMerchantGroupCategoryId) {
        categoryId = currMerchantGroupCategoryId;
      }
    }

    dbTransactions.push({
      id: newTransaction.id,
      created: new Date(newTransaction.created).toISOString(),
      description: newTransaction.description,
      amount: newTransaction.amount.toString(),
      currency: newTransaction.currency,
      fees: newTransaction.fees,
      notes: newTransaction.notes,
      monzo_category: newTransaction.category || null,
      settled: newTransaction.settled
        ? new Date(newTransaction.settled).toISOString()
        : null,
      localAmount: newTransaction.local_amount.toString(),
      localCurrency: newTransaction.local_currency,
      accountId: newTransaction.account_id,
      categoryId,
      merchantId: newTransaction.merchant
        ? newTransaction.merchant.id
        : null,
      merchantGroupId: newTransaction.merchant
        ? newTransaction.merchant.group_id
        : null,
    });

    // Only add new categories if they don't exist
    const isNewCustomCategory =
      !!category &&
      !currCategoryIds.has(category) &&
      !dbCategoriesMap.has(category);
    if (isNewCustomCategory) {
      dbCategoriesMap.set(category, {
        id: category,
        name: category,
        isMonzo: true,
        accountId,
      });
    }

    // Only add new merchants if they don't exist
    if (
      !!merchant &&
      !currMerchantIds.has(merchant.id) &&
      !dbMerchantsMap.has(merchant.id)
    ) {
      dbMerchantsMap.set(merchant.id, {
        id: merchant.id,
        groupId: merchant.group_id,
        address: merchant.address,
        online: merchant.online,
        accountId,
      });
    }

    // Only add new merchant groups if they don't exist
    if (
      !!merchant &&
      !currMerchantGroupIds.has(merchant.group_id) &&
      !dbMerchantGroupsMap.has(merchant.group_id)
    ) {
      dbMerchantGroupsMap.set(merchant.group_id, {
        id: merchant.group_id,
        name: merchant.name,
        logo: merchant.logo,
        emoji: merchant.emoji,
        disableFeedback: merchant.disable_feedback,
        atm: merchant.atm,
        metadata: merchant.metadata,
        monzo_category: merchant.category || null,
        categoryId: merchant.category || null,
        accountId,
      });
    }
  }

  return {
    transactions: dbTransactions,
    merchants: Array.from(dbMerchantsMap.values()),
    merchantGroups: Array.from(dbMerchantGroupsMap.values()),
    categories: Array.from(dbCategoriesMap.values()),
  };
}

export const POST = withAuthAccessToken<{ transactionCount: number }>(
  async ({ request, accessToken }) => {
    try {
      const { accountId } = await request.json();

      if (!accountId) {
        return MiddlewareResponse.badRequest("Account ID is required");
      }

      const [lastTransaction] = await db
        .select({ created: monzoTransactions.created })
        .from(monzoTransactions)
        .where(eq(monzoTransactions.accountId, accountId))
        .orderBy(desc(monzoTransactions.created))
        .limit(1);

      if (!lastTransaction) {
        return MiddlewareResponse.badRequest(
          "No transactions found. Please seed initial transactions first."
        );
      }

      const [currCategories, currMerchants, currMerchantGroups] =
        await Promise.all([
          db
            .select({ id: monzoCategories.id })
            .from(monzoCategories)
            .where(eq(monzoCategories.accountId, accountId)),
          db
            .select({ id: monzoMerchants.id })
            .from(monzoMerchants)
            .where(eq(monzoMerchants.accountId, accountId)),
          db
            .select({
              id: monzoMerchantGroups.id,
              categoryId: monzoMerchantGroups.categoryId,
            })
            .from(monzoMerchantGroups)
            .where(eq(monzoMerchantGroups.accountId, accountId)),
        ]);

      const newMonzoTransactions = await fetchMonzoTransactions({
        accessToken,
        accountId,
        since: lastTransaction.created,
      });

      if (!newMonzoTransactions || newMonzoTransactions.length === 0) {
        return MiddlewareResponse.success({
          transactionCount: 0,
        });
      }

      // Process transactions to extract new merchants, categories, and groups
      const { transactions, merchants, merchantGroups, categories } =
        getSyncDatabaseData({
          newTransactions: newMonzoTransactions,
          accountId,
          currMerchantGroups,
          currCategories,
          currMerchants,
        });

      await db.transaction(async (tx) => {
        if (categories.length > 0) {
          await tx
            .insert(monzoCategories)
            .values(categories)
            .onConflictDoNothing();
        }

        if (merchantGroups.length > 0) {
          await tx
            .insert(monzoMerchantGroups)
            .values(merchantGroups)
            .onConflictDoNothing();
        }

        if (merchants.length > 0) {
          await tx
            .insert(monzoMerchants)
            .values(merchants)
            .onConflictDoNothing();
        }

        if (transactions.length > 0) {
          await tx
            .insert(monzoTransactions)
            .values(transactions)
            .onConflictDoNothing();
        }
      });

      return MiddlewareResponse.success({
        transactionCount: transactions.length,
      });
    } catch (err) {
      if (err instanceof MonzoApiError) {
        const { status, error } = err;
        if (status === 400)
          return MiddlewareResponse.badRequest(error.message);
        if (status === 401)
          return MiddlewareResponse.unauthorized(error.message);
        if (status === 403)
          return MiddlewareResponse.forbidden(error.message);
      }

      throw err;
    }
  }
);
