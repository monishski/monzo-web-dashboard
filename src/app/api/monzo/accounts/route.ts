import { withAuthAccessToken } from "@/lib/api/middleware";
import { MiddlewareResponse } from "@/lib/api/response";
import { db, monzoAccounts } from "@/lib/db";
import type { MonzoDbAccount } from "@/lib/db/types";

import { fetchAccounts } from "./endpoints";
import { getDatabaseAccount } from "./utils";

export const POST = withAuthAccessToken<MonzoDbAccount>(
  async ({ userId, accessToken }) => {
    const { accounts } = await fetchAccounts(accessToken);
    const retailAccounts = accounts?.filter(
      (account) => account.type === "uk_retail"
    );
    if (!retailAccounts.length) {
      return MiddlewareResponse.notFound("No retail accounts found");
    }

    const [insertedAccount] = await db
      .insert(monzoAccounts)
      .values(
        retailAccounts.map((account) =>
          getDatabaseAccount(account, userId)
        )
      )
      .returning();

    return MiddlewareResponse.created(insertedAccount);
  }
);
