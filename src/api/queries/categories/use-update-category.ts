import type { UseMutationResult } from "@tanstack/react-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { Category } from "@/lib/types";
import { updateCategory } from "@/api/endpoints/categories";

import { categoriesQueryKeys } from "./query-key.factory";

type UseUpdateCategoryProps = {
  onSuccess?: () => void;
};

export const useUpdateCategory = ({
  onSuccess,
}: UseUpdateCategoryProps): UseMutationResult<
  Category,
  Error,
  Pick<Category, "id" | "name">
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, name }) => updateCategory(id, { name }),
    onSuccess: (data) => {
      const { id } = data;

      queryClient.invalidateQueries({
        queryKey: categoriesQueryKeys.categories(),
      });
      queryClient.invalidateQueries({
        queryKey: categoriesQueryKeys.category(id),
      });

      onSuccess?.();
    },
  });
};
