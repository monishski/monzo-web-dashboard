import { and, desc, eq } from "drizzle-orm";

import { withAccount } from "@/lib/api/middleware";
import { MiddlewareResponse } from "@/lib/api/response";
import { db } from "@/lib/db";
import { monzoMerchantGroups } from "@/lib/db/schema/monzo-schema";
import type { MerchantGroup } from "@/lib/types/merchant";

export const GET = withAccount<
  MerchantGroup[],
  { params: Promise<{ id: string }> }
>(async ({ context: { params }, accountId }) => {
  const { id: categoryId } = await params;

  const dbMerchantGroups = await db.query.monzoMerchantGroups.findMany({
    columns: {
      accountId: false,
      createdAt: false,
      updatedAt: false,
    },
    with: {
      category: {
        columns: {
          accountId: false,
          createdAt: false,
          updatedAt: false,
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
    where: and(
      eq(monzoMerchantGroups.categoryId, categoryId),
      eq(monzoMerchantGroups.accountId, accountId)
    ),
    orderBy: desc(monzoMerchantGroups.name),
  });

  return MiddlewareResponse.success(dbMerchantGroups);
});
