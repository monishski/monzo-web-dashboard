import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

import { withAuth } from "@/lib/api/middleware";
import { db } from "@/lib/db";
import {
  monzoAccounts,
  monzoMerchants,
} from "@/lib/db/schema/monzo-schema";
import type { Merchant } from "@/lib/types/merchant";

export const GET = withAuth<Merchant[]>(async ({ userId }) => {
  const account = await db.query.monzoAccounts.findFirst({
    where: eq(monzoAccounts.userId, userId),
  });

  if (!account) {
    return NextResponse.json(
      { success: false, error: "No Monzo account found for this user" },
      { status: 404 }
    );
  }

  const dbMerchants = await db.query.monzoMerchants.findMany({
    with: {
      _category: {
        columns: { userId: false, createdAt: false, updatedAt: false },
      },
    },
    columns: { accountId: false, createdAt: false, updatedAt: false },
    where: eq(monzoMerchants.accountId, account.id),
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
