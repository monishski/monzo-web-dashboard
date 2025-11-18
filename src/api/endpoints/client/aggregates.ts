import type {
  CategoryAggregateApiQuery,
  MerchantGroupAggregateApiQuery,
  TimeSeriesAggregateApiQuery,
} from "@/lib/api/query/aggregates/client";
import type {
  CategoryAggregate,
  MerchantGroupAggregate,
  TimeSeriesAggregate,
} from "@/lib/types";

import { apiHttpClient } from "./api-http-client";

export const fetchCategoryAggregates = async (
  query: CategoryAggregateApiQuery
): Promise<CategoryAggregate[]> =>
  await apiHttpClient.post({
    url: "/aggregates/categories",
    payload: query,
  });

export const fetchMerchantGroupAggregates = async (
  query: MerchantGroupAggregateApiQuery
): Promise<MerchantGroupAggregate[]> =>
  await apiHttpClient.post({
    url: "/aggregates/merchants",
    payload: query,
  });

export const fetchTimeSeriesAggregates = async (
  query: TimeSeriesAggregateApiQuery
): Promise<TimeSeriesAggregate[]> =>
  await apiHttpClient.post({
    url: "/aggregates/timeseries",
    payload: query,
  });
