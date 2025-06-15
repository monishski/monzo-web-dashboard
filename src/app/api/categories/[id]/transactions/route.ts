import { NextResponse } from "next/server";
import { and, desc, eq } from "drizzle-orm";

import { authServer } from "@/lib/auth/auth-server";
import { db } from "@/lib/db";
import { monzoTransactions } from "@/lib/db/schema/monzo-schema";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  try {
    const session = await authServer.api.getSession({
      headers: req.headers,
    });

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { id: categoryId } = await params;
    const body = await req.json();
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

    return NextResponse.json(transactions);
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "An unexpected error occurred";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
