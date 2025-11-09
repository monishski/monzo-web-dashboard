import type { UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";

import type { Transaction } from "@/lib/types";
import { fetchTransaction } from "@/api/endpoints/client/transactions";

import { transactionsQueryKeys } from "./query-key.factory";

export const useGetTransaction = (
  id: Transaction["id"]
): UseQueryResult<Transaction> =>
  useQuery({
    queryKey: transactionsQueryKeys.transaction(id),
    queryFn: () => fetchTransaction(id),
    enabled: !!id,
  });
