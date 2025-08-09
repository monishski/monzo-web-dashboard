import { and, asc, desc, eq, ilike, inArray, sql } from "drizzle-orm";
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

    const where = [eq(monzoMerchants.accountId, accountId)];

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
    orderBy.push(asc(monzoMerchantGroups.name));

    // Get total count first
    const [{ count }] = await db
      .select({
        count: sql<number>`count(distinct ${monzoMerchantGroups.id})`,
      })
      .from(monzoMerchantGroups)
      .leftJoin(
        monzoMerchants,
        eq(monzoMerchantGroups.id, monzoMerchants.groupId)
      )
      .where(and(...where));

    // Get paginated results using db.query
    const dbMerchantGroups = await db.query.monzoMerchantGroups.findMany({
      columns: {
        categoryId: false,
        accountId: false,
        createdAt: false,
        updatedAt: false,
      },
      with: {
        merchants: {
          columns: {
            accountId: false,
            createdAt: false,
            updatedAt: false,
          },
          where: eq(monzoMerchants.accountId, accountId),
        },
        category: {
          columns: {
            accountId: false,
            createdAt: false,
            updatedAt: false,
          },
        },
      },
      where: and(...where),
      orderBy,
      offset,
      limit,
    });

    // Get transaction counts for each merchant group
    const merchantGroupIds = dbMerchantGroups.map((mg) => mg.id);

    const transactionCounts = await db
      .select({
        merchantGroupId: monzoTransactions.merchantGroupId,
        count: sql<number>`count(*)`,
      })
      .from(monzoTransactions)
      .where(
        and(
          eq(monzoTransactions.accountId, accountId),
          inArray(monzoTransactions.merchantGroupId, merchantGroupIds)
        )
      )
      .groupBy(monzoTransactions.merchantGroupId);

    const transactionCountMap = new Map(
      transactionCounts.map((tc) => [tc.merchantGroupId, tc.count])
    );

    const merchantGroups: MerchantGroup[] = dbMerchantGroups.map(
      (dbMerchantGroup) => {
        const { merchants: dbMerchants } = dbMerchantGroup;
        const transactionsCount =
          transactionCountMap.get(dbMerchantGroup.id) || 0;

        return {
          ...dbMerchantGroup,
          merchants: dbMerchants.map((dbMerchant) => ({
            ...dbMerchant,
            address: dbMerchant.address as Merchant["address"],
          })),
          transactionsCount,
        };
      }
    );

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
