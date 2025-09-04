import {
  and,
  asc,
  between,
  countDistinct,
  desc,
  eq,
  ilike,
  inArray,
} from "drizzle-orm";
import type { PgColumn } from "drizzle-orm/pg-core";

import { withAccount } from "@/lib/api/middleware";
import { createApiQuerySchema } from "@/lib/api/query-schema";
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
  "category",
  "merchantGroup",
] as const;
const TRANSACTION_SEARCH_FIELDS = [
  "description",
  "category",
  "merchantGroup",
] as const;
const TRANSACTION_NUMERIC_FILTER_FIELDS = [
  "amount",
  "localAmount",
] as const;
const TRANSACTION_DATE_FILTER_FIELDS = ["created", "settled"] as const;
const TRANSACTION_STRING_FILTER_FIELDS = [
  "category",
  "merchantGroup",
] as const;

const transactionsSortFieldMap: Record<
  (typeof TRANSACTION_SORT_FIELDS)[number],
  PgColumn
> = {
  description: monzoTransactions.description,
  created: monzoTransactions.created,
  amount: monzoTransactions.amount,
  localAmount: monzoTransactions.localAmount,
  category: monzoCategories.name,
  merchantGroup: monzoMerchantGroups.name,
};
const transactionsSearchFieldMap: Record<
  (typeof TRANSACTION_SEARCH_FIELDS)[number],
  PgColumn
> = {
  description: monzoTransactions.description,
  category: monzoCategories.name,
  merchantGroup: monzoMerchantGroups.name,
};
const transactionsStringFilterFieldMap: Record<
  (typeof TRANSACTION_STRING_FILTER_FIELDS)[number],
  PgColumn
> = {
  category: monzoTransactions.categoryId,
  merchantGroup: monzoTransactions.merchantGroupId,
};

const TransactionsApiQuerySchema = createApiQuerySchema({
  sort: TRANSACTION_SORT_FIELDS,
  search: TRANSACTION_SEARCH_FIELDS,
  filters: {
    numeric: TRANSACTION_NUMERIC_FILTER_FIELDS,
    date: TRANSACTION_DATE_FILTER_FIELDS,
    string: TRANSACTION_STRING_FILTER_FIELDS,
  },
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

    const [[{ total }], transactions] = await Promise.all([
      db
        .select({ total: countDistinct(monzoTransactions.id) })
        .from(monzoTransactions)
        .where(and(...where)),

      db
        .select({
          transaction: {
            id: monzoTransactions.id,
            created: monzoTransactions.created,
            description: monzoTransactions.description,
            amount: monzoTransactions.amount,
            currency: monzoTransactions.currency,
            fees: monzoTransactions.fees,
            notes: monzoTransactions.notes,
            monzo_category: monzoTransactions.monzo_category,
            settled: monzoTransactions.settled,
            localAmount: monzoTransactions.localAmount,
            localCurrency: monzoTransactions.localCurrency,
          },
          category: {
            id: monzoCategories.id,
            name: monzoCategories.name,
            isMonzo: monzoCategories.isMonzo,
          },
          merchant: {
            id: monzoMerchants.id,
            groupId: monzoMerchants.groupId,
            online: monzoMerchants.online,
            address: monzoMerchants.address,
          },
          merchantGroup: {
            id: monzoMerchantGroups.id,
            name: monzoMerchantGroups.name,
            logo: monzoMerchantGroups.logo,
            emoji: monzoMerchantGroups.emoji,
          },
        })
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
    ]);

    return MiddlewareResponse.success({
      data: transactions.map((_transaction) => {
        const { transaction, category, merchant, merchantGroup } =
          _transaction;

        return {
          ...transaction,
          fees: transaction.fees as Record<string, unknown>,
          amount: Number(transaction.amount),
          localAmount: Number(transaction.localAmount),
          merchant: merchant && {
            ...merchant,
            address: merchant.address as MerchantAddress,
          },
          category,
          merchantGroup,
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
