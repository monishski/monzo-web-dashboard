import { withAuthAccessToken } from "@/lib/api/middleware";
import { MiddlewareResponse } from "@/lib/api/response";
import type {
  MonzoDbCategory,
  MonzoDbMerchant,
  MonzoDbTransaction,
} from "@/lib/db";
import { db } from "@/lib/db";
import {
  monzoCategories,
  monzoMerchants,
  monzoTransactions,
} from "@/lib/db/schema/monzo-schema";
import { fetchMonzoTransactions, MonzoApiError } from "@/lib/http/monzo";
import type { MonzoTransaction } from "@/lib/http/types";

const DEFAULT_CATEGORIES: {
  id: string;
  name: string;
}[] = [
  { id: "entertainment", name: "Entertainment" },
  { id: "general", name: "General" },
  { id: "groceries", name: "Groceries" },
  { id: "eating_out", name: "Eating Out" },
  { id: "charity", name: "Charity" },
  { id: "expenses", name: "Expenses" },
  { id: "family", name: "Family" },
  { id: "finances", name: "Finances" },
  { id: "gifts", name: "Gifts" },
  { id: "personal_care", name: "Personal Care" },
  { id: "shopping", name: "Shopping" },
  { id: "transport", name: "Transport" },
  { id: "income", name: "Income" },
  { id: "savings", name: "Savings" },
  { id: "transfers", name: "Transfers" },
  { id: "holidays", name: "Holidays" },
];

const DEFAULT_CATEGORIES_IDS = DEFAULT_CATEGORIES.map((c) => c.id);

export function getDatabaseData({
  transactions,
  accountId,
}: {
  transactions: MonzoTransaction[];
  accountId: string;
}): {
  transactions: MonzoDbTransaction[];
  merchants: MonzoDbMerchant[];
  categories: MonzoDbCategory[];
} {
  const dbTransactions = [] as MonzoDbTransaction[];
  const dbMerchantsMap = new Map<string, MonzoDbMerchant>();
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
      created: new Date(transaction.created),
      description: transaction.description,
      // TODO: ?Drizzle ORM expects these values as strings to maintain precision?
      amount: transaction.amount.toString(),
      currency: transaction.currency,
      fees: transaction.fees,
      notes: transaction.notes,
      monzo_category: transaction.category || null,
      settled: transaction.settled ? new Date(transaction.settled) : null,
      localAmount: transaction.local_amount.toString(),
      localCurrency: transaction.local_currency,
      accountId: transaction.account_id,
      categoryId: transaction.category || null,
      merchantId: transaction.merchant ? transaction.merchant.id : null,
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

    const isNewMerchant = !!merchant && !dbMerchantsMap.has(merchant.id);
    if (isNewMerchant) {
      dbMerchantsMap.set(merchant.id, {
        id: merchant.id,
        groupId: merchant.group_id,
        name: merchant.name,
        logo: merchant.logo,
        emoji: merchant.emoji,
        monzo_category: merchant.category || null,
        online: merchant.online,
        atm: merchant.atm,
        address: merchant.address,
        disableFeedback: merchant.disable_feedback,
        metadata: merchant.metadata,
        categoryId: merchant.category || null,
        accountId,
      });
    }
  }

  return {
    transactions: dbTransactions,
    merchants: Array.from(dbMerchantsMap.values()),
    categories: Array.from(dbCategoriesMap.values()),
  };
}

export const POST = withAuthAccessToken(
  async ({ request, accessToken }) => {
    try {
      const { accountId } = await request.json();
      if (!accountId) {
        return MiddlewareResponse.badRequest("Account ID is required");
      }

      const _monzoTransactions = await fetchMonzoTransactions(
        accessToken,
        accountId
      );

      if (!_monzoTransactions || _monzoTransactions.length === 0) {
        return MiddlewareResponse.badRequest("No transactions found");
      }

      // Process transactions to extract merchants and categories
      const { transactions, merchants, categories } = getDatabaseData({
        transactions: _monzoTransactions,
        accountId,
      });

      await db.transaction(async (tx) => {
        await tx.insert(monzoCategories).values(categories);

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
