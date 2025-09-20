import { withAuthAccessToken } from "@/lib/api/middleware";
import { MiddlewareResponse } from "@/lib/api/response";
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

const DEFAULT_CATEGORIES: {
  id: string;
  name: string;
}[] = [
  { id: "bills", name: "Bills" },
  { id: "charity", name: "Charity" },
  { id: "eating_out", name: "Eating Out" },
  { id: "entertainment", name: "Entertainment" },
  { id: "expenses", name: "Expenses" },
  { id: "family", name: "Family" },
  { id: "finances", name: "Finances" },
  { id: "general", name: "General" },
  { id: "gifts", name: "Gifts" },
  { id: "groceries", name: "Groceries" },
  { id: "holidays", name: "Holidays" },
  { id: "income", name: "Income" },
  { id: "personal_care", name: "Personal Care" },
  { id: "savings", name: "Savings" },
  { id: "shopping", name: "Shopping" },
  { id: "transfers", name: "Transfers" },
  { id: "transport", name: "Transport" },
];

const DEFAULT_CATEGORIES_IDS = DEFAULT_CATEGORIES.map((c) => c.id);

function getDatabaseData({
  transactions,
  accountId,
}: {
  transactions: MonzoTransaction[];
  accountId: string;
}): {
  transactions: MonzoDbTransaction[];
  merchants: MonzoDbMerchant[];
  merchantGroups: MonzoDbMerchantGroup[];
  categories: MonzoDbCategory[];
} {
  const dbTransactions = [] as MonzoDbTransaction[];
  const dbMerchantsMap = new Map<string, MonzoDbMerchant>();
  const dbMerchantGroupsMap = new Map<string, MonzoDbMerchantGroup>();
  const dbCategoriesMap = new Map<string, MonzoDbCategory>();

  // Prepopulate categories map with default categories
  for (const category of DEFAULT_CATEGORIES) {
    dbCategoriesMap.set(category.id, {
      id: category.id,
      name: category.name,
      isMonzo: true,
      accountId,
    });
  }

  for (const transaction of transactions) {
    const { merchant, category } = transaction;

    dbTransactions.push({
      id: transaction.id,
      created: new Date(transaction.created).toISOString(),
      description: transaction.description,
      // TODO: ?Drizzle ORM expects these values as strings to maintain precision?
      amount: transaction.amount.toString(),
      currency: transaction.currency,
      fees: transaction.fees,
      notes: transaction.notes,
      monzo_category: transaction.category || null,
      settled: transaction.settled
        ? new Date(transaction.settled).toISOString()
        : null,
      localAmount: transaction.local_amount.toString(),
      localCurrency: transaction.local_currency,
      accountId: transaction.account_id,
      categoryId: transaction.category || null,
      merchantId: transaction.merchant ? transaction.merchant.id : null,
      merchantGroupId: transaction.merchant
        ? transaction.merchant.group_id
        : null,
    });

    const isNewCustomCategory =
      !DEFAULT_CATEGORIES_IDS.includes(category) &&
      !!category &&
      !dbCategoriesMap.has(category);
    if (isNewCustomCategory) {
      dbCategoriesMap.set(category, {
        id: category,
        name: category,
        isMonzo: true,
        accountId,
      });
    }

    if (merchant && !dbMerchantsMap.has(merchant.id)) {
      dbMerchantsMap.set(merchant.id, {
        id: merchant.id,
        groupId: merchant.group_id,
        address: merchant.address,
        online: merchant.online,
        accountId,
      });
    }

    if (merchant && !dbMerchantGroupsMap.has(merchant.group_id)) {
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

export const POST = withAuthAccessToken(
  async ({ request, accessToken }) => {
    try {
      const { accountId, accountCreated } = await request.json();
      if (!accountId || !accountCreated) {
        return MiddlewareResponse.badRequest("Account is required");
      }

      const _monzoTransactions = await fetchMonzoTransactions(
        accessToken,
        accountId,
        accountCreated
      );

      if (!_monzoTransactions || _monzoTransactions.length === 0) {
        return MiddlewareResponse.badRequest("No transactions found");
      }

      // Process transactions to extract merchants and categories
      const { transactions, merchants, merchantGroups, categories } =
        getDatabaseData({
          transactions: _monzoTransactions,
          accountId,
        });

      await db.transaction(async (tx) => {
        await tx.insert(monzoCategories).values(categories);

        await tx.insert(monzoMerchantGroups).values(merchantGroups);

        await tx.insert(monzoMerchants).values(merchants);

        await tx
          .insert(monzoTransactions)
          .values(transactions)
          .returning();
      });

      return MiddlewareResponse.created();
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
