import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

import { auth } from "@/lib/auth/auth";
import { db, monzoAccounts } from "@/lib/db";

import { fetchAccounts } from "./endpoints";

export async function GET(request: Request): Promise<NextResponse> {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
    }

    const accounts = await db
      .select()
      .from(monzoAccounts)
      .where(eq(monzoAccounts.userId, session.user.id));

    const retailAccount = accounts?.find((account) => account.type === "uk_retail");

    return NextResponse.json({ account: retailAccount || null });
  } catch (error) {
    const message = error instanceof Error ? error.message : "An unexpected error occurred";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
    }

    const { accessToken } = await auth.api.getAccessToken({
      body: { providerId: "monzo", userId: session.user.id },
    });

    if (!accessToken) {
      return NextResponse.json({ error: "No access token" }, { status: 401 });
    }

    const { accounts } = await fetchAccounts(accessToken);

    const retailAccounts = accounts?.filter((account) => account.type === "uk_retail");

    if (!retailAccounts.length) throw Error("Unable to find retail accounts");

    await db.delete(monzoAccounts).where(eq(monzoAccounts.userId, session.user.id));

    const insertedAccounts = await db
      .insert(monzoAccounts)
      .values(
        retailAccounts.map((account) => ({
          id: account.id,
          created: new Date(account.created),
          type: account.type,
          ownerType: account.owner_type,
          isFlex: account.is_flex,
          productType: account.product_type,
          currency: account.currency,
          // NOTE: owners contains multiple 'user_id' (its an array) but
          // we separately save a 'user_id' field below to reference
          // the user that saved the data and to make it easier to link to auth user table
          owners: account.owners,
          accountNumber: account.account_number,
          sortCode: account.sort_code,
          userId: session.user.id,
        }))
      )
      .returning();

    return NextResponse.json({ accounts: insertedAccounts });
  } catch (error) {
    const message = error instanceof Error ? error.message : "An unexpected error occurred";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
