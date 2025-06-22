import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { authServer } from "@/lib/auth/auth-server";

import type { ApiResponse, Handler } from "./types";

export function withErrorHandling<Data, Context = unknown>(
  handler: Handler<Data, Context>
): Handler<Data, Context> {
  return async (
    request,
    context
  ): Promise<NextResponse<ApiResponse<Data>>> => {
    try {
      return await handler(request, context);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "An unexpected error occurred";
      return NextResponse.json(
        { success: false, error: message },
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
  }) => Promise<NextResponse<ApiResponse<Data>>>
): Handler<Data, Context> {
  return withErrorHandling(async function (request, context): Promise<
    NextResponse<ApiResponse<Data>>
  > {
    const session = await authServer.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const userId = session.user.id;
    return handler({ request, context, userId });
  });
}

export function withAuthAccessToken<Data, Context = unknown>(
  handler: (args: {
    request: NextRequest;
    context: Context;
    userId: string;
    accessToken: string;
  }) => Promise<NextResponse<ApiResponse<Data>>>
): Handler<Data, Context> {
  return withAuth(async function (args): Promise<
    NextResponse<ApiResponse<Data>>
  > {
    const { userId } = args;

    const { accessToken } = await authServer.api.getAccessToken({
      body: { providerId: "monzo", userId },
    });

    if (!accessToken) {
      return NextResponse.json(
        { success: false, error: "Unauthorised" },
        { status: 401 }
      );
    }

    return handler({ ...args, accessToken });
  });
}
