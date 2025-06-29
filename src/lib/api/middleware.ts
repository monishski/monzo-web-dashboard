import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

import { authServer } from "@/lib/auth/auth-server";
import { db, monzoAccounts } from "@/lib/db";

import { MiddlewareResponse } from "./response";
import type { ApiResponse } from "./types";

type Handler<Data, Context> = (
  request: NextRequest,
  context: Context
) => Promise<NextResponse<ApiResponse<Data>>>;

export function withErrorHandling<Data, Context = unknown>(
  handler: (
    request: NextRequest,
    context: Context
  ) => Promise<ApiResponse<Data>>
): Handler<Data, Context> {
  return async (
    request,
    context
  ): Promise<NextResponse<ApiResponse<Data>>> => {
    try {
      const res = await handler(request, context);

      if (!res.success) {
        const { error, status } = res;
        return NextResponse.json(
          MiddlewareResponse.error({ error, status })
        );
      }

      const { status, data } = res;
      return NextResponse.json(MiddlewareResponse.ok({ status, data }));
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "An unexpected error occurred";

      return NextResponse.json(
        MiddlewareResponse.internalServerError(message)
      );
    }
  };
}

export function withAuth<Data, Context = unknown>(
  handler: (args: {
    request: NextRequest;
    context: Context;
    userId: string;
  }) => Promise<ApiResponse<Data>>
): Handler<Data, Context> {
  return withErrorHandling(async function (request, context): Promise<
    ApiResponse<Data>
  > {
    const session = await authServer.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      return MiddlewareResponse.unauthorized();
    }

    const userId = session.user.id;
    return await handler({ request, context, userId });
  });
}

export function withAuthAccessToken<Data, Context = unknown>(
  handler: (args: {
    request: NextRequest;
    context: Context;
    userId: string;
    accessToken: string;
  }) => Promise<ApiResponse<Data>>
): Handler<Data, Context> {
  return withAuth(async function (args): Promise<ApiResponse<Data>> {
    const { userId } = args;

    const { accessToken } = await authServer.api.getAccessToken({
      body: { providerId: "monzo", userId },
    });

    if (!accessToken) {
      return MiddlewareResponse.unauthorized();
    }

    return await handler({ ...args, accessToken });
  });
}

export function withAccount<Data, Context = unknown>(
  handler: (args: {
    request: NextRequest;
    context: Context;
    userId: string;
    accountId: string;
  }) => Promise<ApiResponse<Data>>
): Handler<Data, Context> {
  return withAuth(async function (args): Promise<ApiResponse<Data>> {
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
