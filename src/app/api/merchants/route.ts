import { eq } from "drizzle-orm";

import { withAccount } from "@/lib/api/middleware";
import { MiddlewareResponse } from "@/lib/api/response";
import { db } from "@/lib/db";
import { monzoMerchants } from "@/lib/db/schema/monzo-schema";
import type { Merchant, MerchantGroup } from "@/lib/types";

export const GET = withAccount<MerchantGroup[]>(async ({ accountId }) => {
  const dbMerchantGroups = await db.query.monzoMerchantGroups.findMany({
    columns: {
      accountId: false,
      createdAt: false,
      updatedAt: false,
    },
    with: {
      transactions: {
        columns: {
          accountId: false,
          createdAt: false,
          updatedAt: false,
          merchantId: false,
          merchantGroupId: false,
          categoryId: false,
        },
      },
      merchants: {
        columns: {
          accountId: false,
          createdAt: false,
          updatedAt: false,
        },
      },
    },
    where: eq(monzoMerchants.accountId, accountId),
  });

  const merchantGroups: MerchantGroup[] = dbMerchantGroups.map(
    (dbMerchantGroup) => {
      const { merchants: dbMerchants, transactions: dbTransactions } =
        dbMerchantGroup;

      return {
        ...dbMerchantGroup,
        merchants: dbMerchants.map((dbMerchant) => ({
          ...dbMerchant,
          address: dbMerchant.address as Merchant["address"],
        })),
        transactions: dbTransactions.map((dbTransaction) => ({
          ...dbTransaction,
          created:
            dbTransaction.created instanceof Date
              ? dbTransaction.created.toISOString()
              : dbTransaction.created,
          settled:
            dbTransaction.settled instanceof Date
              ? dbTransaction.settled.toISOString()
              : dbTransaction.settled,
          fees: dbTransaction.fees as Record<string, unknown>,
          amount: Number(dbTransaction.amount),
          localAmount: Number(dbTransaction.localAmount),
        })),
      };
    }
  );

  return MiddlewareResponse.success(merchantGroups);
});
