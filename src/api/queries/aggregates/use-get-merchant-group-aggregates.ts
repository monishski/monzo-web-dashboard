import type { UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";

import type { MerchantGroupAggregateApiQuery } from "@/lib/api/query/aggregates/client";
import type { MerchantGroupAggregate } from "@/lib/types";
import { fetchMerchantGroupAggregates } from "@/api/endpoints/client/aggregates";

import { aggregatesQueryKeys } from "./query-key.factory";

export const useGetMerchantGroupAggregates = (
  query: MerchantGroupAggregateApiQuery
): UseQueryResult<MerchantGroupAggregate[]> =>
  useQuery({
    queryKey: aggregatesQueryKeys.merchantGroups(query),
    queryFn: () => fetchMerchantGroupAggregates(query),
  });
