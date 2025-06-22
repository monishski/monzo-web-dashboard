import { NextResponse } from "next/server";
import { and, desc, eq } from "drizzle-orm";

import { withAuth } from "@/lib/api/middleware";
import { db } from "@/lib/db";
import { monzoTransactions } from "@/lib/db/schema/monzo-schema";

// NOTE: this is a POST request even though we are fetching because of the request body
export const POST = withAuth<
  (typeof monzoTransactions.$inferSelect)[],
  { params: { id: string } }
>(async ({ request, context: { params } }) => {
  const { id: categoryId } = await params;
  const body = await request.json();
  const { accountId } = body;

  const transactions = await db
    .select()
    .from(monzoTransactions)
    .where(
      and(
        eq(monzoTransactions.categoryId, categoryId),
        eq(monzoTransactions.accountId, accountId)
      )
    )
    .orderBy(desc(monzoTransactions.created));

  return NextResponse.json({ success: true, data: transactions });
});
