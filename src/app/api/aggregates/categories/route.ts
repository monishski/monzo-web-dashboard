import { sql } from "drizzle-orm";

import { MiddlewareResponse, withAccount } from "@/lib/api";
import { CategoryAggregateApiQuerySchema } from "@/lib/api/query/aggregates/server";
import {
  db,
  monzoCategories,
  monzoMerchantGroups,
  monzoTransactions,
} from "@/lib/db";
import type { CategoryAggregate } from "@/lib/types";

export const POST = withAccount<CategoryAggregate[]>(
  async ({ accountId, request }) => {
    const body = await request.json();
    const { date, categoryIds, merchantGroupIds } =
      CategoryAggregateApiQuerySchema.parse(body);

    const categoryFilter =
      categoryIds && categoryIds.length > 0
        ? sql`AND t.category_id = ANY(${categoryIds})`
        : sql.raw("");

    const merchantGroupFilter =
      merchantGroupIds && merchantGroupIds.length > 0
        ? sql`AND t.merchant_group_id = ANY(${merchantGroupIds})`
        : sql.raw("");

    const result = await db.execute<CategoryAggregate>(
      sql`
      SELECT
        c.id,
        c.name,
        SUM(t.amount) as amount,
        COUNT(*)::int as count,
        COALESCE(
          json_agg(
            DISTINCT jsonb_build_object(
              'id', mg.id,
              'name', mg.name,
              'logo', mg.logo,
              'emoji', mg.emoji,
              'amount', mg_agg.amount,
              'count', mg_agg.count
            )
          ) FILTER (WHERE mg.id IS NOT NULL),
          '[]'::json
        ) as "merchantGroups"
      FROM ${monzoTransactions} t
      INNER JOIN ${monzoCategories} c ON t.category_id = c.id
      LEFT JOIN ${monzoMerchantGroups} mg ON t.merchant_group_id = mg.id
      LEFT JOIN (
        SELECT
          t2.category_id,
          t2.merchant_group_id,
          SUM(t2.amount) as amount,
          COUNT(*)::int as count
        FROM ${monzoTransactions} t2
        WHERE t2.account_id = ${accountId}
          AND t2.created BETWEEN ${date.from} AND ${date.to}
          ${categoryFilter}
          ${merchantGroupFilter}
        GROUP BY t2.category_id, t2.merchant_group_id
      ) mg_agg ON mg_agg.category_id = c.id AND mg_agg.merchant_group_id = mg.id
      WHERE t.account_id = ${accountId}
        AND t.created BETWEEN ${date.from} AND ${date.to}
        ${categoryFilter}
        ${merchantGroupFilter}
      GROUP BY c.id, c.name
      ORDER BY SUM(t.amount) DESC
    `
    );

    return MiddlewareResponse.success(result);
  }
);
