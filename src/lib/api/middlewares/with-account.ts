import type { NextRequest } from "next/server";
import { eq } from "drizzle-orm";

import { db, monzoAccounts } from "@/lib/db";

import type { ApiResponse } from "../types";
import { MiddlewareResponse } from "./middleware-response";
import type { Handler } from "./types";
import { withAuth } from "./with-auth";

export function withAccount<Data, Context = unknown>(
  handler: (args: {
    request: NextRequest;
    context: Context;
    userId: string;
    accountId: string;
  }) => Promise<ApiResponse<Data>>
): Handler<Data, Context> {
  return withAuth(async function (args) {
    const { userId } = args;

    const account = await db.query.monzoAccounts.findFirst({
      where: eq(monzoAccounts.userId, userId),
    });

    if (!account) {
      return MiddlewareResponse.notFound("Account not found");
    }

    return await handler({ ...args, accountId: account.id });
  });
}
