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
import type { MerchantAddress, Transaction } from "@/lib/types";

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
  categoryId: monzoCategories.id,
  merchantGroupId: monzoMerchantGroups.id,
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
            from: z.iso.datetime(),
            to: z.iso.datetime(),
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

    const where = [
      eq(monzoTransactions.accountId, accountId),
      // Search
      ...(search
        ? [
            ilike(
              transactionsSearchFieldMap[search.by],
              `%${search.value}%`
            ),
          ]
        : []),
      // Numeric filters
      ...(filters?.numeric || []).map((numericFilter) =>
        between(
          monzoTransactions[numericFilter.by],
          numericFilter.from.toString(),
          numericFilter.to.toString()
        )
      ),
      // Date filters
      ...(filters?.date || []).map((dateFilter) =>
        between(
          monzoTransactions[dateFilter.by],
          new Date(dateFilter.from),
          new Date(dateFilter.to)
        )
      ),
      // String filters
      ...(filters?.string || []).map((stringFilter) =>
        inArray(
          transactionsStringFilterFieldMap[stringFilter.by],
          stringFilter.values
        )
      ),
    ];

    // Sorting
    const orderBy =
      sort && sort.length > 0
        ? [
            ...sort.map((s) =>
              s.order === "asc"
                ? asc(transactionsSortFieldMap[s.by])
                : desc(transactionsSortFieldMap[s.by])
            ),
            desc(monzoTransactions.created),
          ]
        : [desc(monzoTransactions.created)];

    const [dbTransactions, [{ count }]] = await Promise.all([
      db
        .select()
        .from(monzoTransactions)
        .leftJoin(
          monzoCategories,
          eq(monzoTransactions.categoryId, monzoCategories.id)
        )
        .leftJoin(
          monzoMerchants,
          eq(monzoTransactions.merchantId, monzoMerchants.id)
        )
        .leftJoin(
          monzoMerchantGroups,
          eq(monzoTransactions.merchantGroupId, monzoMerchantGroups.id)
        )
        .where(and(...where))
        .orderBy(...orderBy)
        .offset(offset)
        .limit(limit),

      db
        .select({ count: sql<number>`count(*)` })
        .from(monzoTransactions)
        .leftJoin(
          monzoCategories,
          eq(monzoTransactions.categoryId, monzoCategories.id)
        )
        .leftJoin(
          monzoMerchants,
          eq(monzoTransactions.merchantId, monzoMerchants.id)
        )
        .leftJoin(
          monzoMerchantGroups,
          eq(monzoTransactions.merchantGroupId, monzoMerchantGroups.id)
        )
        .where(and(...where)),
    ]);

    // Transform the database results into the expected format
    const transactions: Transaction[] = dbTransactions.map(
      (dbTransaction) => {
        const {
          monzo_transactions,
          monzo_categories,
          monzo_merchants,
          monzo_merchant_groups,
        } = dbTransaction;

        return {
          ...monzo_transactions,
          created:
            monzo_transactions.created instanceof Date
              ? monzo_transactions.created.toISOString()
              : monzo_transactions.created,
          settled:
            monzo_transactions.settled instanceof Date
              ? monzo_transactions.settled.toISOString()
              : monzo_transactions.settled,
          fees: monzo_transactions.fees as Record<string, unknown>,
          amount: Number(monzo_transactions.amount),
          localAmount: Number(monzo_transactions.localAmount),
          merchant: monzo_merchants
            ? {
                id: monzo_merchants.id,
                groupId: monzo_merchants.groupId,
                online: monzo_merchants.online,
                address: monzo_merchants.address as MerchantAddress,
              }
            : null,
          category: monzo_categories
            ? {
                id: monzo_categories.id,
                name: monzo_categories.name,
                isMonzo: monzo_categories.isMonzo,
              }
            : null,
          merchantGroup: monzo_merchant_groups
            ? {
                id: monzo_merchant_groups.id,
                name: monzo_merchant_groups.name,
                logo: monzo_merchant_groups.logo,
                emoji: monzo_merchant_groups.emoji,
              }
            : null,
        };
      }
    );

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
