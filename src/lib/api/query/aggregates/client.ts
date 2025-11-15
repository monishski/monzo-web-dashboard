import type { Period } from "./types";

export type AggregateApiQuery = {
  date?: { from: string; to: string };
  categoryIds?: string[];
  merchantGroupIds?: string[];
};

export type TimeSeriesAggregateApiQuery = AggregateApiQuery & {
  period: Period;
};

export type MerchantGroupAggregateApiQuery = AggregateApiQuery;

export type CategoryAggregateApiQuery = AggregateApiQuery;
