import qs from "qs";

import type { MonzoTransaction } from "@/types/monzo/transaction";

export const fetchTransactions = async (
  accessToken: string,
  accountId: string
): Promise<{ total: number; data: { transactions: MonzoTransaction[] } }> => {
  const transactionsMap: Record<string, MonzoTransaction> = {};
  let before = new Date();

  while (true) {
    const queryParams = qs.stringify(
      {
        expand: ["merchant"],
        account_id: accountId,
        limit: 100,
        before: before.toISOString(),
      },
      { arrayFormat: "brackets" }
    );

    const url = `${process.env.MONZO_API_URL}/transactions?${queryParams}`;

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      // TODO: Note, only 5 mins are given after authenticating to access ALL the transactions
      // Monzo will throw a 403 error with the 'code' as 'forbidden.verification_required'
      throw new Error(JSON.stringify(error));
    }

    const { transactions } = await response.json();

    // REF: https://community.monzo.com/t/changes-when-listing-with-our-api/158676/22
    let newTransactionsFound = false;
    for (const transaction of transactions) {
      const { id, created } = transaction;
      if (!transactionsMap[id]) {
        transactionsMap[id] = transaction;
        newTransactionsFound = true;
        const txnCreated = new Date(created);
        if (txnCreated < before) {
          before = txnCreated;
        }
      }
    }

    if (!newTransactionsFound) break;
  }

  const transactions = Object.values(transactionsMap);

  return {
    total: transactions.length,
    data: { transactions },
  };
};
