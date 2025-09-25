import type { UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";

import type { Account } from "@/lib/types";
import { fetchAccount } from "@/api/endpoints/account";

import { accountQueryKeys } from "./query-key.factory";

export const useGetAccount = (): UseQueryResult<Account> =>
  useQuery({
    queryKey: accountQueryKeys.account(),
    queryFn: fetchAccount,
  });
