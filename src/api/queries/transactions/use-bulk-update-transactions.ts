import type { UseMutationResult } from "@tanstack/react-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { BulkUpdateTransactionScope } from "@/lib/api/types/response";
import type { Category, Transaction } from "@/lib/types";
import { bulkUpdateTransactions } from "@/api/endpoints/transactions";

import { transactionsQueryKeys } from "./query-key.factory";

type UseBulkUpdateTransactionsProps = {
  onSuccess?: () => void;
};

export const useBulkUpdateTransactions = ({
  onSuccess,
}: UseBulkUpdateTransactionsProps): UseMutationResult<
  string,
  Error,
  {
    transactionId: Transaction["id"];
    categoryId: Category["id"];
    scope: BulkUpdateTransactionScope;
  }
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: bulkUpdateTransactions,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: transactionsQueryKeys.transactions(),
      });

      onSuccess?.();
    },
  });
};
