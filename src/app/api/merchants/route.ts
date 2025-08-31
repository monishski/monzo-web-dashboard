import {
  and,
  asc,
  count,
  countDistinct,
  desc,
  eq,
  ilike,
  inArray,
  max,
  sql,
} from "drizzle-orm";
import type { PgColumn } from "drizzle-orm/pg-core";
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

    const [[{ total }], merchantGroups] = await Promise.all([
      db
        .select({
          total: countDistinct(monzoMerchantGroups.id),
        })
        .from(monzoMerchantGroups)
        .leftJoin(
          monzoCategories,
          eq(monzoMerchantGroups.categoryId, monzoCategories.id)
        )
        .where(and(...where)),

      db
        .select({
          merchantGroup: {
            id: monzoMerchantGroups.id,
            name: monzoMerchantGroups.name,
            logo: monzoMerchantGroups.logo,
            emoji: monzoMerchantGroups.emoji,
            disableFeedback: monzoMerchantGroups.disableFeedback,
            atm: monzoMerchantGroups.atm,
            monzo_category: monzoMerchantGroups.monzo_category,
          },
          category: {
            id: monzoCategories.id,
            name: monzoCategories.name,
            isMonzo: monzoCategories.isMonzo,
          },
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
          transactionsCount: count(monzoTransactions.id),
          lastTransactionDate: max(monzoTransactions.created),
        })
        .from(monzoMerchantGroups)
        .leftJoin(
          monzoCategories,
          eq(monzoMerchantGroups.categoryId, monzoCategories.id)
        )
        .leftJoin(
          monzoTransactions,
          and(
            eq(monzoTransactions.merchantGroupId, monzoMerchantGroups.id),
            eq(monzoTransactions.accountId, accountId)
          )
        )
        .where(and(...where))
        .groupBy(monzoMerchantGroups.id, monzoCategories.id)
        .orderBy(...orderBy)
        .offset(offset)
        .limit(limit),
    ]);

    return MiddlewareResponse.success({
      data: merchantGroups.map((_merchantGroup) => {
        const {
          merchantGroup,
          category,
          merchants,
          transactionsCount,
          lastTransactionDate,
        } = _merchantGroup;

        return {
          ...merchantGroup,
          category,
          merchants,
          transactionsCount,
          lastTransactionDate,
        };
      }),
      pagination: {
        total,
        page,
        size: limit,
      },
    });
  }
);
