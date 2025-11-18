import { sql } from "drizzle-orm";

import { MiddlewareResponse, withAccount } from "@/lib/api";
import { MerchantGroupAggregateApiQuerySchema } from "@/lib/api/query/aggregates/server";
import {
  db,
  monzoCategories,
  monzoMerchantGroups,
  monzoTransactions,
} from "@/lib/db";
import type { MerchantGroupAggregate } from "@/lib/types";

export const POST = withAccount<MerchantGroupAggregate[]>(
  async ({ accountId, request }) => {
    const body = await request.json();
    const { date, categoryIds, merchantGroupIds } =
      MerchantGroupAggregateApiQuerySchema.parse(body);

    const categoryFilter =
      categoryIds && categoryIds.length > 0
        ? sql`AND t.category_id = ANY(${categoryIds})`
        : sql.raw("");

    const merchantGroupFilter =
      merchantGroupIds && merchantGroupIds.length > 0
        ? sql`AND t.merchant_group_id = ANY(${merchantGroupIds})`
        : sql.raw("");

    const result = await db.execute<MerchantGroupAggregate>(
      sql`
      SELECT
        mg.id,
        mg.name,
        mg.logo,
        mg.emoji,
        SUM(t.amount) as amount,
        COUNT(*)::int as count,
        COALESCE(
          json_agg(
            DISTINCT jsonb_build_object(
              'id', c.id,
              'name', c.name,
              'amount', cat_agg.amount,
              'count', cat_agg.count
            )
          ) FILTER (WHERE c.id IS NOT NULL),
          '[]'::json
        ) as categories
      FROM ${monzoTransactions} t
      INNER JOIN ${monzoMerchantGroups} mg ON t.merchant_group_id = mg.id
      LEFT JOIN ${monzoCategories} c ON t.category_id = c.id
      LEFT JOIN (
        SELECT
          t2.merchant_group_id,
          t2.category_id,
          SUM(t2.amount) as amount,
          COUNT(*)::int as count
        FROM ${monzoTransactions} t2
        WHERE t2.account_id = ${accountId}
          AND t2.created BETWEEN ${date.from} AND ${date.to}
          ${categoryFilter}
          ${merchantGroupFilter}
        GROUP BY t2.merchant_group_id, t2.category_id
      ) cat_agg ON cat_agg.merchant_group_id = mg.id AND cat_agg.category_id = c.id
      WHERE t.account_id = ${accountId}
        AND t.created BETWEEN ${date.from} AND ${date.to}
        ${categoryFilter}
        ${merchantGroupFilter}
      GROUP BY mg.id, mg.name, mg.logo, mg.emoji
      ORDER BY SUM(t.amount) DESC
    `
    );

    return MiddlewareResponse.success(result);
  }
);
