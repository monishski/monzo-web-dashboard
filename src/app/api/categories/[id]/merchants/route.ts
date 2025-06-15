import { NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";

import { authServer } from "@/lib/auth/auth-server";
import { db } from "@/lib/db";
import { monzoMerchants } from "@/lib/db/schema/monzo-schema";

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
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "An unexpected error occurred";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
