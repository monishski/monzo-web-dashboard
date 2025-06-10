import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { genericOAuth } from "better-auth/plugins";

import { db } from "@/lib/db";
import * as authSchema from "@/lib/db/schema/auth-schema";
import type { MonzoUserInfo } from "@/types/monzo/user-info";

if (
  !process.env.MONZO_CLIENT_ID ||
  !process.env.MONZO_CLIENT_SECRET ||
  !process.env.MONZO_AUTHORIZATION_URL ||
  !process.env.MONZO_TOKEN_URL ||
  !process.env.MONZO_USER_INFO_URL ||
  !process.env.BETTER_AUTH_URL
) {
  throw new Error("Monzo env variables must be set");
}

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: authSchema,
  }),
  user: {
    additionalFields: {
      userId: { type: "string" },
      clientId: { type: "string" },
      clientIp: { type: "string" },
    },
  },
  plugins: [
    genericOAuth({
      config: [
        {
          providerId: "monzo",
          clientId: process.env.MONZO_CLIENT_ID,
          clientSecret: process.env.MONZO_CLIENT_SECRET,
          authorizationUrl: process.env.MONZO_AUTHORIZATION_URL,
          authorizationUrlParams: {
            client_id: process.env.MONZO_CLIENT_ID,
            // REF: https://www.better-auth.com/docs/plugins/generic-oauth#handle-oauth-callback
            redirect_uri: `${process.env.BETTER_AUTH_URL}/api/auth/oauth2/callback/monzo`,
            response_type: "code",
          },
          tokenUrl: process.env.MONZO_TOKEN_URL,
          // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
          async getUserInfo(tokens) {
            if (!process.env.MONZO_USER_INFO_URL)
              throw Error("MONZO_USER_INFO_URL env variable must be set");

            const response = await fetch(process.env.MONZO_USER_INFO_URL, {
              headers: {
                Authorization: `Bearer ${tokens.accessToken}`,
              },
            });
            if (!response.ok) throw new Error("Failed to fetch user info");

            const user = (await response.json()) as MonzoUserInfo;

            if (!user.authenticated)
              throw new Error("User unauthenticated");

            const now = new Date();

            return {
              // NOTE: the DB seems to create its own id?
              id: user.user_id,
              // NOTE: that 'email' is required in Better Auth, so we are using placeholder domain
              // REF: https://github.com/better-auth/better-auth/issues/2172
              email: `${user.user_id}@placeholderemail.com`,
              name: "",
              image: "",
              emailVerified: true,
              createdAt: now,
              updatedAt: now,
              // NOTE: these are additional custom fields
              userId: user.user_id,
              clientId: user.client_id,
              clientIp: user.client_ip,
            };
          },
        },
      ],
    }),
  ],
});

export type Session = typeof auth.$Infer.Session;
