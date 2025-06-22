import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

import { withAuth } from "@/lib/api/middleware";
import { db } from "@/lib/db";
import { monzoAccounts } from "@/lib/db/schema/monzo-schema";

export const GET = withAuth<typeof monzoAccounts.$inferSelect>(
  async ({ userId }) => {
    const [account] = await db
      .select()
      .from(monzoAccounts)
      .where(eq(monzoAccounts.userId, userId));

    return NextResponse.json({ success: true, data: account });
  }
);
