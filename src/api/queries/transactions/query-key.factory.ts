import type { TransactionApiQuery } from "@/lib/api/query/transactions/client";
import type { Transaction } from "@/lib/types";

const BASE_QUERY_KEY = "transactions";

export const transactionsQueryKeys = {
  all: [BASE_QUERY_KEY] as const,
  transactions: (query?: TransactionApiQuery) =>
    [BASE_QUERY_KEY, query] as const,
  transaction: (id: Transaction["id"]) => [BASE_QUERY_KEY, id] as const,
};
