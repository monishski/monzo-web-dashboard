import { withAuthAccessToken } from "@/lib/api/middleware";
import { MiddlewareResponse } from "@/lib/api/response";
import { db, monzoAccounts } from "@/lib/db";
import type { MonzoDbAccount } from "@/lib/db";
import { fetchMonzoAccount, MonzoApiError } from "@/lib/http/monzo";

export const POST = withAuthAccessToken<MonzoDbAccount>(
  async ({ userId, accessToken }) => {
    try {
      const account = await fetchMonzoAccount(accessToken);

      if (!account) {
        return MiddlewareResponse.notFound("No retail accounts found");
      }

      const [insertedAccount] = await db
        .insert(monzoAccounts)
        .values([
          {
            id: account.id,
            created: new Date(account.created).toISOString(),
            type: account.type,
            ownerType: account.owner_type,
            isFlex: account.is_flex,
            productType: account.product_type,
            currency: account.currency,
            owners: account.owners,
            accountNumber: account.account_number,
            sortCode: account.sort_code,
            userId: userId,
          },
        ])
        .returning();

      return MiddlewareResponse.created(insertedAccount);
    } catch (err) {
      if (err instanceof MonzoApiError) {
        const { status, error } = err;
        if (status === 400)
          return MiddlewareResponse.badRequest(error.message);
        if (status === 401)
          return MiddlewareResponse.unauthorized(error.message);
        if (status === 403)
          return MiddlewareResponse.forbidden(error.message);
      }

      throw err;
    }
  }
);
