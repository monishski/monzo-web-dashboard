"use client";

import {
  genericOAuthClient,
  inferAdditionalFields,
} from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

import type { authServer } from "./auth-server";

const { useSession, signIn, signOut } = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL,
  plugins: [
    inferAdditionalFields<typeof authServer>(),
    genericOAuthClient(),
  ],
});

export { useSession, signIn, signOut };
