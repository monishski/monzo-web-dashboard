import type { UseMutationResult } from "@tanstack/react-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { Category } from "@/lib/types";
import { deleteCategory } from "@/api/endpoints/categories";

import { categoriesQueryKeys } from "./query-key.factory";

type UseDeleteCategoryProps = {
  onSuccess?: () => void;
};

export const useDeleteCategory = ({
  onSuccess,
}: UseDeleteCategoryProps): UseMutationResult<
  Pick<Category, "id">,
  Error,
  Category["id"]
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCategory,
    onSuccess: (data) => {
      const { id } = data;

      queryClient.invalidateQueries({
        queryKey: categoriesQueryKeys.categories(),
      });
      queryClient.removeQueries({
        queryKey: categoriesQueryKeys.category(id),
      });

      onSuccess?.();
    },
  });
};
