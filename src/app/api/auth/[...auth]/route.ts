import { toNextJsHandler } from "better-auth/next-js";

import { authServer } from "@/lib/auth/auth-server";

export const { GET, POST } = toNextJsHandler(authServer);
