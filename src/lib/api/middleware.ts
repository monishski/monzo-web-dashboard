import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

import { authServer } from "@/lib/auth/auth-server";
import { db, monzoAccounts } from "@/lib/db";

import type { ApiErrorResponse, ApiResponse } from "./types";

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
        return NextResponse.json<ApiErrorResponse>(res, {
          status: res.status || 400,
        });
      }

      return NextResponse.json<ApiResponse<Data>>(res, {
        status: res.status || 200,
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "An unexpected error occurred";

      return NextResponse.json<ApiErrorResponse>(
        { status: 500, success: false, error: message },
        { status: 500 }
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
      return { status: 401, success: false, error: "Unauthorized" };
    }

    const userId = session.user.id;
    const res = await handler({ request, context, userId });
    return res;
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
      return { status: 401, success: false, error: "Unauthorised" };
    }

    const res = handler({ ...args, accessToken });
    return res;
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
      return { status: 404, success: false, error: "Account not found" };
    }

    const res = handler({ ...args, accountId: account.id });
    return res;
  });
}
