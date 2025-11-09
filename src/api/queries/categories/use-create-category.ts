import type { UseMutationResult } from "@tanstack/react-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { Category } from "@/lib/types";
import { createCategory } from "@/api/endpoints/client/categories";

import { categoriesQueryKeys } from "./query-key.factory";

type UseCreateCategoryProps = {
  onSuccess?: () => void;
};

export const useCreateCategory = ({
  onSuccess,
}: UseCreateCategoryProps): UseMutationResult<
  Category,
  Error,
  Pick<Category, "name">
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: categoriesQueryKeys.categories(),
      });

      onSuccess?.();
    },
  });
};
