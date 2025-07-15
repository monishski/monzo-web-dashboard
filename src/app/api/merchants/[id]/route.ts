import { eq } from "drizzle-orm";

import { withAccount } from "@/lib/api/middleware";
import { MiddlewareResponse } from "@/lib/api/response";
import { db } from "@/lib/db";
import { monzoMerchantGroups } from "@/lib/db/schema/monzo-schema";
import type { MerchantAddress, MerchantGroup } from "@/lib/types";

export const GET = withAccount<
  MerchantGroup,
  { params: Promise<{ id: string }> }
>(async ({ context: { params } }) => {
  const { id: groupId } = await params;

  const dbMerchantGroup = await db.query.monzoMerchantGroups.findFirst({
    columns: {
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
    where: eq(monzoMerchantGroups.id, groupId),
  });

  if (!dbMerchantGroup) {
    return MiddlewareResponse.notFound("Merchant group not found");
  }

  const { merchants, ...rest } = dbMerchantGroup;
  const merchantGroup: MerchantGroup = {
    ...rest,
    merchants: (Array.isArray(merchants) ? merchants : []).map(
      (dbMerchant) => ({
        ...dbMerchant,
        address: dbMerchant.address as MerchantAddress,
      })
    ),
    category: dbMerchantGroup.category,
  };

  return MiddlewareResponse.success(merchantGroup);
});

export const PUT = withAccount<
  MerchantGroup,
  { params: Promise<{ id: string }> }
>(async ({ request, context: { params }, accountId: _accountId }) => {
  const { id: groupId } = await params;
  const body = await request.json();
  const { categoryId } = body;

  if (!categoryId) {
    return MiddlewareResponse.badRequest("Category is required");
  }

  const [dbMerchantGroup] = await db
    .update(monzoMerchantGroups)
    .set({ categoryId })
    .where(eq(monzoMerchantGroups.id, groupId))
    .returning();

  if (!dbMerchantGroup) {
    return MiddlewareResponse.notFound("Merchant group not found");
  }

  return MiddlewareResponse.success(dbMerchantGroup);
});
