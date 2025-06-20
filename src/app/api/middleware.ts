import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { authServer } from "@/lib/auth/auth-server";

type HandlerContext = { params: Record<string, string> };

type Handler<Context extends HandlerContext> = (
  request: NextRequest,
  context: Context
) => Promise<Response>;

export function withErrorHandling<Context extends HandlerContext>(
  handler: Handler<Context>
): Handler<Context> {
  return async (request, context): Promise<Response> => {
    try {
      return await handler(request, context);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "An unexpected error occurred";
      return NextResponse.json({ error: message }, { status: 500 });
    }
  };
}

export function withAuth<Context extends HandlerContext>(
  handler: (args: {
    request: NextRequest;
    context: Context;
    userId: string;
  }) => Promise<Response>
): Handler<Context> {
  return withErrorHandling(
    async function (request, context): Promise<Response> {
      const session = await authServer.api.getSession({
        headers: request.headers,
      });

      if (!session) {
        return new NextResponse("Unauthorized", { status: 401 });
      }

      const userId = session.user.id;
      return handler({ request, context, userId });
    }
  );
}
