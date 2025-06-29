import { and, desc, eq } from "drizzle-orm";

import { withAccount } from "@/lib/api/middleware";
import { MiddlewareResponse } from "@/lib/api/response";
import { db } from "@/lib/db";
import { monzoMerchants } from "@/lib/db/schema/monzo-schema";
import type { Merchant } from "@/lib/types/merchant";

export const GET = withAccount<
  Merchant[],
  { params: Promise<{ id: string }> }
>(async ({ context: { params }, accountId }) => {
  const { id: categoryId } = await params;

  const dbMerchants = await db.query.monzoMerchants.findMany({
    columns: {
      disableFeedback: false,
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
    },
    where: and(
      eq(monzoMerchants.categoryId, categoryId),
      eq(monzoMerchants.accountId, accountId)
    ),
    orderBy: desc(monzoMerchants.name),
  });

  const merchants: Merchant[] = dbMerchants.map((dbMerchant) => {
    return {
      ...dbMerchant,
      address: dbMerchant.address as Merchant["address"],
      metadata: dbMerchant.metadata as Merchant["metadata"],
    };
  });

  return MiddlewareResponse.success(merchants);
});
