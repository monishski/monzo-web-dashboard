import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

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

export const db = drizzle(client);
