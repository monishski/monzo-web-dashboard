import type { monzoMerchants, monzoTransactions } from "@/lib/db";
import type { TransactionMerchant } from "@/types/common";

import type { MonzoTransaction } from "./types";

export function getDatabaseMerchant(
  merchant: TransactionMerchant,
  accountId: string
): typeof monzoMerchants.$inferInsert {
  const { group_id, disable_feedback, ...other } = merchant;
  return {
    ...other,
    groupId: group_id,
    disableFeedback: disable_feedback,
    accountId,
  };
}

export function getDatabaseTransaction(
  transaction: MonzoTransaction
): typeof monzoTransactions.$inferInsert {
  const { created, amount, local_amount, local_currency, settled, merchant, account_id, ...other } =
    transaction;

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
  };
}
