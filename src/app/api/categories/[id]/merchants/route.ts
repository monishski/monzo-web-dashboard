import { NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";

import { db } from "@/lib/db";
import { monzoMerchants } from "@/lib/db/schema/monzo-schema";
import { withAuth } from "@/app/api/middleware";

// NOTE: this is a POST request even though we are fetching because of the request body
export const POST = withAuth<{ params: { id: string } }>(
  async ({ request, context: { params } }) => {
    const { id: categoryId } = await params;
    const body = await request.json();
    const { accountId } = body;

    const merchants = await db
      .select()
      .from(monzoMerchants)
      .where(
        and(
          eq(monzoMerchants.categoryId, categoryId),
          eq(monzoMerchants.accountId, accountId)
        )
      )
      .orderBy(monzoMerchants.name);

    return NextResponse.json(merchants);
  }
);
