import { AxiosError } from "axios";
import dayjs from "dayjs";
import qs from "qs";

import type {
  MonzoError,
  MonzoTransaction,
} from "@/lib/api/types/monzo-entities";

import { MonzoApiError } from "./monzo-api-error";
import { monzoHttpClient } from "./monzo-http-client";

export const fetchMonzoTransactions = async ({
  accessToken,
  accountId,
  since,
}: {
  accessToken: string;
  accountId: string;
  since: string;
}): Promise<MonzoTransaction[]> => {
  try {
    const transactionsMap: Record<string, MonzoTransaction> = {};
    let sinceDate = new Date(since); // Start date
    // Max difference between since and before is 12 months (1 year)
    let before = dayjs(sinceDate).add(11, "month").toDate(); // End date
    const now = new Date();

    while (true) {
      const queryParams = qs.stringify(
        {
          expand: ["merchant"],
          account_id: accountId,
          limit: 100,
          before: before > now ? now.toISOString() : before.toISOString(), // Required
          since: sinceDate.toISOString(),
        },
        { arrayFormat: "brackets" }
      );

      const { transactions } = await monzoHttpClient.get<{
        transactions: MonzoTransaction[];
      }>({
        url: `/transactions?${queryParams}`,
        config: {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      });

      // REF: https://community.monzo.com/t/changes-when-listing-with-our-api/158676/22
      let newTransactionsFound = false;
      for (const transaction of transactions) {
        const { id, created } = transaction;
        if (!transactionsMap[id]) {
          transactionsMap[id] = transaction;
          newTransactionsFound = true;
          const txnCreated = new Date(created);
          if (txnCreated > sinceDate) {
            sinceDate = txnCreated;
          }
        }
      }

      before = dayjs(sinceDate).add(11, "month").toDate();

      if (!newTransactionsFound) break;
    }

    const transactions = Object.values(transactionsMap);

    return transactions;
  } catch (err) {
    if (err instanceof AxiosError && err.response) {
      const { status, data } = err.response;
      throw new MonzoApiError({
        status,
        error: data as MonzoError,
      });
    }

    throw err;
  }
};
