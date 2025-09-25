import type { Account } from "@/lib/types";

import { apiHttpClient } from "./client";

export const fetchAccount = async (): Promise<Account> =>
  await apiHttpClient.get<Account>({
    url: "/accounts",
  });
