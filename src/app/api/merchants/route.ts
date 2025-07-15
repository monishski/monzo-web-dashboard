import { eq } from "drizzle-orm";

import { withAccount } from "@/lib/api/middleware";
import { MiddlewareResponse } from "@/lib/api/response";
import { db } from "@/lib/db";
import { monzoMerchants } from "@/lib/db/schema/monzo-schema";
import type { Merchant, MerchantGroup } from "@/lib/types";

export const GET = withAccount<MerchantGroup[]>(async ({ accountId }) => {
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
      },
      category: {
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
      const { merchants: dbMerchants } = dbMerchantGroup;

      return {
        ...dbMerchantGroup,
        merchants: dbMerchants.map((dbMerchant) => ({
          ...dbMerchant,
          address: dbMerchant.address as Merchant["address"],
        })),
      };
    }
  );

  return MiddlewareResponse.success(merchantGroups);
});
