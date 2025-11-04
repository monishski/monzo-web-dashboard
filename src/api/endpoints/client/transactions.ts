import type { TransactionApiQuery } from "@/lib/api/query/transactions/client";
import type {
  BulkUpdateTransactionScope,
  PaginatedData,
} from "@/lib/api/types/response";
import type { Category, MerchantGroup, Transaction } from "@/lib/types";

import { apiHttpClient } from "./api-http-client";

export const fetchTransactions = async (
  query: TransactionApiQuery
): Promise<PaginatedData<Transaction>> =>
  await apiHttpClient.post({
    url: "/transactions",
    payload: query,
  });

export const fetchTransaction = async (
  id: Transaction["id"]
): Promise<Transaction> =>
  await apiHttpClient.get({
    url: `/transactions/${id}`,
  });

export const updateTransaction = async (
  id: Transaction["id"],
  payload: {
    categoryId?: Category["id"];
    merchantGroupId?: MerchantGroup["id"];
  }
): Promise<Transaction> =>
  await apiHttpClient.put({
    url: `/transactions/${id}`,
    payload,
  });

export const bulkUpdateTransactions = async (payload: {
  transactionId: Transaction["id"];
  categoryId: Category["id"];
  scope: BulkUpdateTransactionScope;
}): Promise<string> =>
  await apiHttpClient.post({
    url: "/transactions/bulk",
    payload,
  });
