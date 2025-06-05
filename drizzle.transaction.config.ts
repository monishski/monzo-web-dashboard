import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./src/lib/db/migrations",
  schema: "./src/lib/db/schema",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL_TRANSACTION_POOLER!,
  },
  verbose: true,
  strict: true,
});
