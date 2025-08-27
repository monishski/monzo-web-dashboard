import { and, asc, desc, eq, ilike, inArray, sql } from "drizzle-orm";
import type { PgColumn } from "drizzle-orm/pg-core";
import omit from "lodash/omit";
import * as z from "zod";

import { withAccount } from "@/lib/api/middleware";
import { MiddlewareResponse } from "@/lib/api/response";
import type { PaginatedData } from "@/lib/api/types";
import {
  db,
  monzoCategories,
  monzoMerchantGroups,
  monzoMerchants,
  monzoTransactions,
} from "@/lib/db";
import type { Merchant, MerchantGroup } from "@/lib/types";

const MERCHANT_GROUP_SORT_FIELDS = ["name", "categoryId"] as const;
const MERCHANT_GROUP_SEARCH_FIELDS = ["name"] as const;
const MERCHANT_GROUP_STRING_FILTER_FIELDS = ["categoryId"] as const;

// TODO: this should be based on Client-Server types, NOT Server-DB
const merchantGroupSortFieldMap: Record<
  (typeof MERCHANT_GROUP_SORT_FIELDS)[number],
  PgColumn
> = {
  name: monzoMerchantGroups.name,
  categoryId: monzoCategories.name,
};
const merchantGroupSearchFieldMap: Record<
  (typeof MERCHANT_GROUP_SEARCH_FIELDS)[number],
  PgColumn
> = {
  name: monzoMerchantGroups.name,
};
const merchantGroupStringFilterFieldMap: Record<
  (typeof MERCHANT_GROUP_STRING_FILTER_FIELDS)[number],
  PgColumn
> = {
  categoryId: monzoCategories.id,
};

const MerchantGroupsApiQuerySchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(20),
  sort: z
    .array(
      z.object({
        by: z.enum(MERCHANT_GROUP_SORT_FIELDS),
        order: z.enum(["asc", "desc"]),
      })
    )
    .optional(),
  search: z
    .object({
      by: z.enum(MERCHANT_GROUP_SEARCH_FIELDS),
      value: z.string().min(1).max(100).optional(),
    })
    .optional(),
  filters: z
    .object({
      string: z
        .array(
          z.object({
            by: z.enum(MERCHANT_GROUP_STRING_FILTER_FIELDS),
            values: z.array(z.string()),
          })
        )
        .optional(),
    })
    .optional(),
});

export const POST = withAccount<PaginatedData<MerchantGroup>>(
  async ({ accountId, request }) => {
    const body = await request.json();

    const { page, limit, sort, search, filters } =
      MerchantGroupsApiQuerySchema.parse(body);

    // Pagination
    const offset = (page - 1) * limit;

    const where = [eq(monzoMerchantGroups.accountId, accountId)];

    // Search
    if (search) {
      where.push(
        ilike(merchantGroupSearchFieldMap[search.by], `%${search.value}%`)
      );
    }

    // String Filters
    if (filters?.string) {
      filters.string.forEach((stringFilter) => {
        where.push(
          inArray(
            merchantGroupStringFilterFieldMap[stringFilter.by],
            stringFilter.values
          )
        );
      });
    }

    // Sort
    const orderBy = [];
    if (sort && sort.length > 0) {
      sort.forEach((s) => {
        orderBy.push(
          s.order === "asc"
            ? asc(merchantGroupSortFieldMap[s.by])
            : desc(merchantGroupSortFieldMap[s.by])
        );
      });
    }
    orderBy.push(
      desc(sql<string | null>`(
      SELECT MAX(t.created)
      FROM ${monzoTransactions} t
      WHERE t.merchant_group_id = ${monzoMerchantGroups.id}
      AND t.account_id = ${accountId}
    )`)
    );

    const [[{ count }], tables] = await Promise.all([
      db
        .select({
          count: sql<number>`count(distinct ${monzoMerchantGroups.id})`,
        })
        .from(monzoMerchantGroups)
        .leftJoin(
          monzoCategories,
          eq(monzoMerchantGroups.categoryId, monzoCategories.id)
        )
        .where(and(...where)),

      db
        .select({
          merchantGroup: monzoMerchantGroups,
          category: monzoCategories,
          merchants: sql<Merchant[]>`(
            SELECT COALESCE(
              json_agg(
                CASE 
                  WHEN m.id IS NOT NULL 
                  THEN json_build_object(
                    'id', m.id,
                    'groupId', m.group_id,
                    'online', m.online,
                    'address', m.address
                  )
                  ELSE NULL
                END
              ) FILTER (WHERE m.id IS NOT NULL),
              '[]'::json
            )
            FROM ${monzoMerchants} m
            WHERE m.group_id = ${monzoMerchantGroups.id}
          )`,
          transactionsCount: sql<number>`(
            SELECT COUNT(*)
            FROM ${monzoTransactions} t
            WHERE t.merchant_group_id = ${monzoMerchantGroups.id}
            AND t.account_id = ${accountId}
          )`,
          lastTransactionDate: sql<Date | null>`(
            SELECT MAX(t.created)
            FROM ${monzoTransactions} t
            WHERE t.merchant_group_id = ${monzoMerchantGroups.id}
            AND t.account_id = ${accountId}
          )`,
        })
        .from(monzoMerchantGroups)
        .leftJoin(
          monzoCategories,
          eq(monzoMerchantGroups.categoryId, monzoCategories.id)
        )
        .where(and(...where))
        .orderBy(...orderBy)
        .offset(offset)
        .limit(limit),
    ]);

    // Transform the database results into the expected format
    const merchantGroups: MerchantGroup[] = tables.map((table) => {
      const {
        merchantGroup,
        category,
        merchants,
        transactionsCount,
        lastTransactionDate,
      } = table;

      return {
        ...omit(merchantGroup, ["accountId", "createdAt", "updatedAt"]),
        category: category ? omit(category, ["accountId"]) : null,
        merchants,
        transactionsCount,
        lastTransactionDate:
          lastTransactionDate instanceof Date
            ? lastTransactionDate.toISOString()
            : lastTransactionDate,
      };
    });

    return MiddlewareResponse.success({
      data: merchantGroups,
      pagination: {
        total: count,
        page,
        size: limit,
      },
    });
  }
);
