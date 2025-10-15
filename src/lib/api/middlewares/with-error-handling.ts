import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import type { ApiResponse } from "../types";
import { MiddlewareResponse } from "./middleware-response";
import type { Handler } from "./types";

export function withErrorHandling<Data, Context = unknown>(
  handler: (
    request: NextRequest,
    context: Context
  ) => Promise<ApiResponse<Data>>
): Handler<Data, Context> {
  return async (request, context) => {
    try {
      const res = await handler(request, context);

      if (!res.success) {
        const { error, status } = res;
        return NextResponse.json(
          MiddlewareResponse.error({ error, status }),
          { status }
        );
      }

      const { status, data } = res;
      return NextResponse.json(MiddlewareResponse.ok({ status, data }), {
        status,
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "An unexpected error occurred";

      return NextResponse.json(
        MiddlewareResponse.internalServerError(message),
        { status: 500 }
      );
    }
  };
}
