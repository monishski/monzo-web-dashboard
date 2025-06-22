import { NextResponse } from "next/server";
import { and, desc, eq } from "drizzle-orm";

import { withAuth } from "@/lib/api/middleware";
import { db } from "@/lib/db";
import { monzoMerchants } from "@/lib/db/schema/monzo-schema";
import type { Merchant } from "@/lib/types/merchant";

// NOTE: this is a POST request even though we are fetching because of the request body
export const POST = withAuth<
  Merchant[],
  { params: Promise<{ id: string }> }
>(async ({ request, context: { params } }) => {
  const { id: categoryId } = await params;
  const body = await request.json();
  const { accountId } = body;

  const dbMerchants = await db.query.monzoMerchants.findMany({
    columns: {
      disableFeedback: false,
      accountId: false,
      createdAt: false,
      updatedAt: false,
    },
    with: {
      _category: {
        columns: {
          userId: false,
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

  return NextResponse.json({ success: true, data: merchants });
});
