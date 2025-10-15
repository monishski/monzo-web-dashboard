import type { UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";

import type { TransactionApiQuery } from "@/lib/api/query/transactions/client";
import type { PaginatedData } from "@/lib/api/types/response";
import type { Transaction } from "@/lib/types";
import { fetchTransactions } from "@/api/endpoints/transactions";

import { transactionsQueryKeys } from "./query-key.factory";

export const useGetTransactions = (
  query: TransactionApiQuery
): UseQueryResult<PaginatedData<Transaction>> =>
  useQuery({
    queryKey: transactionsQueryKeys.transactions(query),
    queryFn: () => fetchTransactions(query),
  });
