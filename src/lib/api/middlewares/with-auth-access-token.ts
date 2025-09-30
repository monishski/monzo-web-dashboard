import type { NextRequest } from "next/server";

import { authServer } from "@/lib/auth/auth-server";

import type { ApiResponse } from "../types";
import { MiddlewareResponse } from "./middleware-response";
import type { Handler } from "./types";
import { withAuth } from "./with-auth";

export function withAuthAccessToken<Data, Context = unknown>(
  handler: (args: {
    request: NextRequest;
    context: Context;
    userId: string;
    accessToken: string;
  }) => Promise<ApiResponse<Data>>
): Handler<Data, Context> {
  return withAuth(async function (args) {
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
