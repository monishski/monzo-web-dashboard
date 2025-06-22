import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import * as authSchema from "./schema/auth-schema";
import * as monzoSchema from "./schema/monzo-schema";

if (!process.env.DATABASE_URL_TRANSACTION_POOLER) {
  throw new Error("DATABASE_URL_TRANSACTION_POOLER is not set");
}

// Disable prefetch as it is not supported for "Transaction" pool mode
export const client = postgres(
  process.env.DATABASE_URL_TRANSACTION_POOLER,
  {
    prepare: false,
  }
);

const schema = {
  ...authSchema,
  ...monzoSchema,
};

export const db = drizzle(client, { schema });
