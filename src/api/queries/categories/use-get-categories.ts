import type { UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";

import type { Category } from "@/lib/types";
import { fetchCategories } from "@/api/endpoints/categories";

import { categoriesQueryKeys } from "./query-key.factory";

export const useGetCategories = (): UseQueryResult<Category[]> =>
  useQuery({
    queryKey: categoriesQueryKeys.categories(),
    queryFn: fetchCategories,
  });
