import type { Account } from "@/lib/types";

import { httpClient } from "./instance";

export const fetchAccount = async (): Promise<Account> =>
  await httpClient.get<Account>({
    url: "/accounts",
  });
