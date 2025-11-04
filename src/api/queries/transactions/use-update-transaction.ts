import type { UseMutationResult } from "@tanstack/react-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { Category, MerchantGroup, Transaction } from "@/lib/types";
import { updateTransaction } from "@/api/endpoints/client/transactions";

import { transactionsQueryKeys } from "./query-key.factory";

type UseUpdateTransactionProps = {
  onSuccess?: () => void;
};

export const useUpdateTransaction = ({
  onSuccess,
}: UseUpdateTransactionProps): UseMutationResult<
  Transaction,
  Error,
  {
    id: Transaction["id"];
    categoryId?: Category["id"];
    merchantGroupId?: MerchantGroup["id"];
  }
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, categoryId, merchantGroupId }) =>
      updateTransaction(id, { categoryId, merchantGroupId }),
    onSuccess: (data) => {
      const { id } = data;

      queryClient.invalidateQueries({
        queryKey: transactionsQueryKeys.transactions(),
      });
      queryClient.invalidateQueries({
        queryKey: transactionsQueryKeys.transaction(id),
      });

      onSuccess?.();
    },
  });
};
