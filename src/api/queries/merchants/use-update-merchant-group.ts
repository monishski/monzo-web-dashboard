import type { UseMutationResult } from "@tanstack/react-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { MerchantGroup } from "@/lib/types";
import { updateMerchantGroup } from "@/api/endpoints/client/merchants";

import { merchantsQueryKeys } from "./query-key.factory";

type UseUpdateMerchantGroupProps = {
  onSuccess?: () => void;
};

export const useUpdateMerchantGroup = ({
  onSuccess,
}: UseUpdateMerchantGroupProps): UseMutationResult<
  MerchantGroup,
  Error,
  { id: MerchantGroup["id"]; categoryId: string }
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, categoryId }) =>
      updateMerchantGroup(id, { categoryId }),
    onSuccess: (data) => {
      const { id } = data;

      queryClient.invalidateQueries({
        queryKey: merchantsQueryKeys.merchantGroups(),
      });
      queryClient.invalidateQueries({
        queryKey: merchantsQueryKeys.merchantGroup(id),
      });

      onSuccess?.();
    },
  });
};
