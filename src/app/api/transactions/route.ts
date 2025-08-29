import {
  and,
  asc,
  between,
  desc,
  eq,
  ilike,
  inArray,
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
import type {
  Category,
  Merchant,
  MerchantGroup,
  Transaction,
} from "@/lib/types";

const TRANSACTION_SORT_FIELDS = [
  "description",
  "created",
  "amount",
  "localAmount",
  "categoryId",
  "merchantGroupId",
] as const;
const TRANSACTION_SEARCH_FIELDS = [
  "description",
  "categoryId",
  "merchantGroupId",
] as const;
const TRANSACTION_NUMERIC_FILTER_FIELDS = [
  "amount",
  "localAmount",
] as const;
const TRANSACTION_DATE_FILTER_FIELDS = ["created", "settled"] as const;
const TRANSACTION_STRING_FILTER_FIELDS = [
  "categoryId",
  "merchantGroupId",
] as const;

// TODO: check if this cross-referecing of tables works with db.query
const transactionsSortFieldMap: Record<
  (typeof TRANSACTION_SORT_FIELDS)[number],
  PgColumn
> = {
  description: monzoTransactions.description,
  created: monzoTransactions.created,
  amount: monzoTransactions.amount,
  localAmount: monzoTransactions.localAmount,
  categoryId: monzoCategories.name,
  merchantGroupId: monzoMerchantGroups.name,
};
const transactionsSearchFieldMap: Record<
  (typeof TRANSACTION_SEARCH_FIELDS)[number],
  PgColumn
> = {
  description: monzoTransactions.description,
  categoryId: monzoCategories.name,
  merchantGroupId: monzoMerchantGroups.name,
};
const transactionsStringFilterFieldMap: Record<
  (typeof TRANSACTION_STRING_FILTER_FIELDS)[number],
  PgColumn
> = {
  categoryId: monzoTransactions.categoryId,
  merchantGroupId: monzoTransactions.merchantGroupId,
};

const TransactionsApiQuerySchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(20),
  sort: z
    .array(
      z.object({
        by: z.enum(TRANSACTION_SORT_FIELDS),
        order: z.enum(["asc", "desc"]),
      })
    )
    .optional(),
  search: z
    .object({
      by: z.enum(TRANSACTION_SEARCH_FIELDS),
      value: z.string().min(1).max(100).optional(),
    })
    .optional(),
  filters: z
    .object({
      numeric: z
        .array(
          z.object({
            by: z.enum(TRANSACTION_NUMERIC_FILTER_FIELDS),
            from: z.number(),
            to: z.number(),
          })
        )
        .optional(),
      date: z
        .array(
          z.object({
            by: z.enum(TRANSACTION_DATE_FILTER_FIELDS),
            from: z
              .string()
              .transform((val) => new Date(val).toISOString()),
            to: z.string().transform((val) => new Date(val).toISOString()),
          })
        )
        .optional(),
      string: z
        .array(
          z.object({
            by: z.enum(TRANSACTION_STRING_FILTER_FIELDS),
            values: z.array(z.string()),
          })
        )
        .optional(),
    })
    .optional(),
});

export const POST = withAccount<PaginatedData<Transaction>>(
  async ({ accountId, request }) => {
    const body = await request.json();

    const { page, limit, sort, search, filters } =
      TransactionsApiQuerySchema.parse(body);

    // Pagination
    const offset = (page - 1) * limit;

    const where = [eq(monzoTransactions.accountId, accountId)];

    // Search
    if (search) {
      where.push(
        ilike(transactionsSearchFieldMap[search.by], `%${search.value}%`)
      );
    }

    // Numeric filters
    if (filters?.numeric) {
      filters.numeric.forEach((numericFilter) => {
        where.push(
          between(
            monzoTransactions[numericFilter.by],
            numericFilter.from.toString(),
            numericFilter.to.toString()
          )
        );
      });
    }

    // Date filters
    if (filters?.date) {
      filters.date.forEach((dateFilter) => {
        where.push(
          between(
            monzoTransactions[dateFilter.by],
            dateFilter.from,
            dateFilter.to
          )
        );
      });
    }

    // String filters
    if (filters?.string) {
      filters.string.forEach((stringFilter) => {
        where.push(
          inArray(
            transactionsStringFilterFieldMap[stringFilter.by],
            stringFilter.values
          )
        );
      });
    }

    // Sorting
    const orderBy = [];
    if (sort && sort.length > 0) {
      sort.forEach((s) => {
        orderBy.push(
          s.order === "asc"
            ? asc(transactionsSortFieldMap[s.by])
            : desc(transactionsSortFieldMap[s.by])
        );
      });
    }
    orderBy.push(desc(monzoTransactions.created));

    const [[{ count }], tables] = await Promise.all([
      db
        .select({ count: sql<number>`count(*)` })
        .from(monzoTransactions)
        .where(and(...where)),

      db
        .select({
          transaction: monzoTransactions,
          category: sql<Pick<Category, "id" | "name" | "isMonzo"> | null>`(
            SELECT CASE 
              WHEN c.id IS NOT NULL 
              THEN json_build_object(
                'id', c.id,
                'name', c.name,
                'isMonzo', c.is_monzo
              )
              ELSE NULL
            END
            FROM ${monzoCategories} c
            WHERE c.id = ${monzoTransactions.categoryId}
          )`,
          merchant: sql<Merchant | null>`(
            SELECT CASE 
              WHEN m.id IS NOT NULL 
              THEN json_build_object(
                'id', m.id,
                'groupId', m.group_id,
                'online', m.online,
                'address', m.address::jsonb
              )
              ELSE NULL
            END
            FROM ${monzoMerchants} m
            WHERE m.id = ${monzoTransactions.merchantId}
          )`,
          merchantGroup: sql<Pick<
            MerchantGroup,
            "id" | "name" | "logo" | "emoji"
          > | null>`( 
            SELECT CASE 
              WHEN mg.id IS NOT NULL 
              THEN json_build_object(
                'id', mg.id,
                'name', mg.name,
                'logo', mg.logo,
                'emoji', mg.emoji
              )
              ELSE NULL
            END
            FROM ${monzoMerchantGroups} mg
            WHERE mg.id = ${monzoTransactions.merchantGroupId}
          )`,
        })
        .from(monzoTransactions)
        .where(and(...where))
        .orderBy(...orderBy)
        .offset(offset)
        .limit(limit),
    ]);

    // Transform the database results into the expected format
    const transactions: Transaction[] = tables.map((table) => {
      const { transaction, category, merchant, merchantGroup } = table;

      return {
        ...transaction,
        fees: transaction.fees as Record<string, unknown>,
        amount: Number(transaction.amount),
        localAmount: Number(transaction.localAmount),
        merchant,
        category,
        merchantGroup,
      };
    });

    return MiddlewareResponse.success({
      data: transactions,
      pagination: {
        total: count,
        page,
        size: limit,
      },
    });
  }
);
