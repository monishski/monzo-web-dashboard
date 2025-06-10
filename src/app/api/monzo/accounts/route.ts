import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

import { authServer } from "@/lib/auth/auth-server";
import { db, monzoAccounts } from "@/lib/db";

import { fetchAccounts } from "./endpoints";
import { getDatabaseAccount } from "./utils";

export async function GET(request: Request): Promise<NextResponse> {
  try {
    const session = await authServer.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      return NextResponse.json(
        { error: "Unauthenticated" },
        { status: 401 }
      );
    }

    const [account] = await db
      .select()
      .from(monzoAccounts)
      .where(eq(monzoAccounts.userId, session.user.id))
      .limit(1);

    return NextResponse.json({ account: account || null });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "An unexpected error occurred";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const session = await authServer.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      return NextResponse.json(
        { error: "Unauthenticated" },
        { status: 401 }
      );
    }

    const { accessToken } = await authServer.api.getAccessToken({
      body: { providerId: "monzo", userId: session.user.id },
    });

    if (!accessToken) {
      return NextResponse.json(
        { error: "No access token" },
        { status: 401 }
      );
    }

    const { accounts } = await fetchAccounts(accessToken);
    const retailAccounts = accounts?.filter(
      (account) => account.type === "uk_retail"
    );
    if (!retailAccounts.length)
      throw Error("Unable to find any retail accounts");

    await db
      .delete(monzoAccounts)
      .where(eq(monzoAccounts.userId, session.user.id));

    const insertedAccounts = await db
      .insert(monzoAccounts)
      .values(
        retailAccounts.map((account) =>
          getDatabaseAccount(account, session.user.id)
        )
      )
      .returning();

    return NextResponse.json({ accounts: insertedAccounts });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "An unexpected error occurred";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
