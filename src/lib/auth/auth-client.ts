"use client";

import { createAuthClient } from "better-auth/react";
import { genericOAuthClient } from "better-auth/client/plugins";

const { useSession, signIn, signOut } = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL,
  plugins: [genericOAuthClient()],
});

export { useSession, signIn, signOut };
