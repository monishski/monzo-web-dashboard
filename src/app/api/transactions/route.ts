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

import { MiddlewareResponse, withAccount } from "@/lib/api";
import {
  TransactionsApiQuerySchema,
  transactionsSearchFieldMap,
  transactionsSortFieldMap,
  transactionsStringFilterFieldMap,
} from "@/lib/api/query/transactions/server";
import type { PaginatedData } from "@/lib/api/types/response";
import {
  db,
  monzoCategories,
  monzoMerchantGroups,
  monzoMerchants,
  monzoTransactions,
} from "@/lib/db";
import type { MerchantAddress, Transaction } from "@/lib/types";

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
