import { sql } from "drizzle-orm";

import { MiddlewareResponse, withAccount } from "@/lib/api";
import { TimeSeriesAggregateApiQuerySchema } from "@/lib/api/query/aggregates/server";
import {
  db,
  monzoCategories,
  monzoMerchantGroups,
  monzoTransactions,
} from "@/lib/db";
import type { TimeSeriesAggregate } from "@/lib/types";

export const POST = withAccount<TimeSeriesAggregate[]>(
  async ({ accountId, request }) => {
    const body = await request.json();
    const { period, date, categoryIds, merchantGroupIds } =
      TimeSeriesAggregateApiQuerySchema.parse(body);

    const categoryFilter =
      categoryIds && categoryIds.length > 0
        ? sql`AND t.category_id = ANY(${categoryIds})`
        : sql.raw("");

    const merchantGroupFilter =
      merchantGroupIds && merchantGroupIds.length > 0
        ? sql`AND t.merchant_group_id = ANY(${merchantGroupIds})`
        : sql.raw("");

    const interval =
      period === "year"
        ? "1 year"
        : period === "month"
          ? "1 month"
          : "1 week";

    const result = await db.execute<TimeSeriesAggregate>(sql`
      WITH time_buckets AS (
        SELECT date_trunc('${sql.raw(period)}', generate_series) as time
        FROM generate_series(
          date_trunc('${sql.raw(period)}', ${date.from}::timestamp),
          date_trunc('${sql.raw(period)}', ${date.to}::timestamp),
          '${sql.raw(interval)}'::interval
        )
      ),
      transaction_agg AS (
        SELECT
          date_trunc('${sql.raw(period)}', t.created) as time,
          SUM(t.amount) as amount,
          COUNT(*)::int as count
        FROM ${monzoTransactions} t
        WHERE t.account_id = ${accountId}
          AND t.created BETWEEN ${date.from} AND ${date.to}
          ${categoryFilter}
          ${merchantGroupFilter}
        GROUP BY date_trunc('${sql.raw(period)}', t.created)
      ),
      category_agg AS (
        SELECT
          cat_sum.time,
          json_agg(
            json_build_object(
              'id', c.id,
              'name', c.name,
              'amount', cat_sum.amount,
              'count', cat_sum.count
            )
            ORDER BY cat_sum.amount ASC
          ) FILTER (WHERE c.id IS NOT NULL AND cat_sum.amount != 0) as categories
        FROM (
          SELECT
            date_trunc('${sql.raw(period)}', t2.created) as time,
            t2.category_id,
            SUM(t2.amount) as amount,
            COUNT(*)::int as count
          FROM ${monzoTransactions} t2
          WHERE t2.account_id = ${accountId}
            AND t2.created BETWEEN ${date.from} AND ${date.to}
            ${categoryFilter}
            ${merchantGroupFilter}
          GROUP BY date_trunc('${sql.raw(period)}', t2.created), t2.category_id
        ) cat_sum
        LEFT JOIN ${monzoCategories} c ON cat_sum.category_id = c.id
        GROUP BY cat_sum.time
      ),
      merchant_agg AS (
        SELECT
          mg_sum.time,
          json_agg(
            json_build_object(
              'id', mg.id,
              'name', mg.name,
              'logo', mg.logo,
              'emoji', mg.emoji,
              'amount', mg_sum.amount,
              'count', mg_sum.count
            )
            ORDER BY mg_sum.amount ASC
          ) FILTER (WHERE mg.id IS NOT NULL AND mg_sum.amount != 0) as merchantGroups
        FROM (
          SELECT
            date_trunc('${sql.raw(period)}', t2.created) as time,
            t2.merchant_group_id,
            SUM(t2.amount) as amount,
            COUNT(*)::int as count
          FROM ${monzoTransactions} t2
          WHERE t2.account_id = ${accountId}
            AND t2.created BETWEEN ${date.from} AND ${date.to}
            ${categoryFilter}
            ${merchantGroupFilter}
          GROUP BY date_trunc('${sql.raw(period)}', t2.created), t2.merchant_group_id
        ) mg_sum
        LEFT JOIN ${monzoMerchantGroups} mg ON mg_sum.merchant_group_id = mg.id
        GROUP BY mg_sum.time
      )
      SELECT
        tb.time,
        COALESCE(ta.amount, 0) as amount,
        COALESCE(ta.count, 0) as count,
        COALESCE(ca.categories, '[]'::json) as categories,
        COALESCE(ma.merchantGroups, '[]'::json) as "merchantGroups"
      FROM time_buckets tb
      LEFT JOIN transaction_agg ta ON tb.time = ta.time
      LEFT JOIN category_agg ca ON tb.time = ca.time
      LEFT JOIN merchant_agg ma ON tb.time = ma.time
      ORDER BY tb.time
    `);

    return MiddlewareResponse.success(result);
  }
);
