import type { UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";

import type { Category } from "@/lib/types";
import { fetchCategory } from "@/api/endpoints/categories";

import { categoriesQueryKeys } from "./query-key.factory";

export const useGetCategory = (
  id: Category["id"]
): UseQueryResult<Category> =>
  useQuery({
    queryKey: categoriesQueryKeys.category(id),
    queryFn: () => fetchCategory(id),
    enabled: !!id,
  });
