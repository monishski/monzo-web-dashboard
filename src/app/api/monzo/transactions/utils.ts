import type {
  monzoCategories,
  monzoMerchants,
  monzoTransactions,
} from "@/lib/db/schema/monzo-schema";

import { DEFAULT_CATEGORIES_IDS } from "./constants";
import type { MonzoMerchant, MonzoTransaction } from "./types";

export function getDatabaseTransaction(
  transaction: MonzoTransaction
): typeof monzoTransactions.$inferInsert {
  const {
    created,
    amount,
    local_amount,
    local_currency,
    settled,
    merchant,
    account_id,
    category,
    ...other
  } = transaction;

  return {
    ...other,
    created: new Date(created),
    // TODO: ?Drizzle ORM expects these values as strings to maintain precision?
    amount: amount.toString(),
    settled: settled ? new Date(settled) : null,
    localAmount: local_amount.toString(),
    localCurrency: local_currency,
    accountId: account_id,
    merchantId: merchant ? merchant.id : null,
    category: category || null,
    categoryId: category || null,
  };
}

export function getDatabaseMerchant(
  merchant: MonzoMerchant,
  accountId: string
): typeof monzoMerchants.$inferInsert {
  const { group_id, category, disable_feedback, ...other } = merchant;

  return {
    ...other,
    groupId: group_id,
    disableFeedback: disable_feedback,
    category: category || null,
    categoryId: category || null,
    accountId,
  };
}

export function getMerchantsAndCategories({
  transactions,
  userId,
  accountId,
}: {
  transactions: MonzoTransaction[];
  userId: string;
  accountId: string;
}): {
  merchants: Map<string, typeof monzoMerchants.$inferInsert>;
  customCategories: Map<string, typeof monzoCategories.$inferInsert>;
} {
  const merchantMap = new Map<
    string,
    typeof monzoMerchants.$inferInsert
  >();
  const customCategoriesMap = new Map<
    string,
    typeof monzoCategories.$inferInsert
  >();

  for (const transaction of transactions) {
    const { merchant, category } = transaction;

    if (
      !DEFAULT_CATEGORIES_IDS.includes(category) &&
      !!category &&
      !customCategoriesMap.has(category)
    ) {
      customCategoriesMap.set(category, {
        id: category,
        name: category,
        isMonzo: true,
        userId,
      });
    }

    if (!!merchant && !merchantMap.has(merchant.id)) {
      merchantMap.set(
        merchant.id,
        getDatabaseMerchant(merchant, accountId)
      );
    }
  }

  return {
    merchants: merchantMap,
    customCategories: customCategoriesMap,
  };
}
