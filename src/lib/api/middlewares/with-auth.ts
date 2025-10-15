import type { NextRequest } from "next/server";

import { authServer } from "@/lib/auth/auth-server";

import type { ApiResponse } from "../types";
import { MiddlewareResponse } from "./middleware-response";
import type { Handler } from "./types";
import { withErrorHandling } from "./with-error-handling";

export function withAuth<Data, Context = unknown>(
  handler: (args: {
    request: NextRequest;
    context: Context;
    userId: string;
  }) => Promise<ApiResponse<Data>>
): Handler<Data, Context> {
  return withErrorHandling(async function (request, context) {
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
