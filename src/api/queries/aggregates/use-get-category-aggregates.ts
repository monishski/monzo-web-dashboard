import type { UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";

import type { CategoryAggregateApiQuery } from "@/lib/api/query/aggregates/client";
import type { CategoryAggregate } from "@/lib/types";
import { fetchCategoryAggregates } from "@/api/endpoints/client/aggregates";

import { aggregatesQueryKeys } from "./query-key.factory";

export const useGetCategoryAggregates = (
  query: CategoryAggregateApiQuery
): UseQueryResult<CategoryAggregate[]> =>
  useQuery({
    queryKey: aggregatesQueryKeys.categories(query),
    queryFn: () => fetchCategoryAggregates(query),
  });
