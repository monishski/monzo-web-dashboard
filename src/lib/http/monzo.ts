import { AxiosError } from "axios";
import qs from "qs";

import { HttpClient } from "./client";
import type { MonzoAccount, MonzoTransaction } from "./types";

const monzoHttpClient = new HttpClient(process.env.MONZO_API_URL);

type MonzoError = {
  code: string;
  error: string;
  error_description?: string;
  message: string;
  retryable?: Record<string, unknown>;
  marshal_count?: number;
  params?: Record<string, unknown>;
};

export class MonzoApiError extends Error {
  status: number;
  error: MonzoError;

  constructor({ status, error }: { status: number; error: MonzoError }) {
    super(error.message);

    this.status = status;
    this.error = error;
  }
}
export const fetchMonzoAccount = async (
  accessToken: string | undefined
): Promise<MonzoAccount | null> => {
  try {
    const { accounts } = await monzoHttpClient.get<{
      accounts: MonzoAccount[];
    }>({
      url: "/accounts",
      config: {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    });

    const retailAccount = accounts?.find(
      (account) => account.type === "uk_retail"
    );

    return retailAccount ?? null;
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

export const fetchMonzoTransactions = async (
  accessToken: string,
  accountId: string
): Promise<MonzoTransaction[]> => {
  try {
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
          if (txnCreated < before) {
            before = txnCreated;
          }
        }
      }

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
