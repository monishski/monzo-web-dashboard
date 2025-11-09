import type { Account } from "@/lib/types";

import { apiHttpClient } from "./api-http-client";

export const fetchAccount = async (): Promise<Account> =>
  await apiHttpClient.get<Account>({
    url: "/accounts",
  });
