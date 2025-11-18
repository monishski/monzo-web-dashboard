import type {
  CategoryAggregateApiQuery,
  MerchantGroupAggregateApiQuery,
  TimeSeriesAggregateApiQuery,
} from "@/lib/api/query/aggregates/client";

const BASE_QUERY_KEY = "aggregates";

export const aggregatesQueryKeys = {
  all: [BASE_QUERY_KEY] as const,
  categories: (query?: CategoryAggregateApiQuery) =>
    [BASE_QUERY_KEY, "categories", query] as const,
  merchantGroups: (query?: MerchantGroupAggregateApiQuery) =>
    [BASE_QUERY_KEY, "merchant-groups", query] as const,
  timeSeries: (query?: TimeSeriesAggregateApiQuery) =>
    [BASE_QUERY_KEY, "timeseries", query] as const,
};
