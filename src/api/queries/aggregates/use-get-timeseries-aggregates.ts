import type { UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";

import type { TimeSeriesAggregateApiQuery } from "@/lib/api/query/aggregates/client";
import type { TimeSeriesAggregate } from "@/lib/types";
import { fetchTimeSeriesAggregates } from "@/api/endpoints/client/aggregates";

import { aggregatesQueryKeys } from "./query-key.factory";

export const useGetTimeSeriesAggregates = (
  query: TimeSeriesAggregateApiQuery
): UseQueryResult<TimeSeriesAggregate[]> =>
  useQuery({
    queryKey: aggregatesQueryKeys.timeSeries(query),
    queryFn: () => fetchTimeSeriesAggregates(query),
  });
