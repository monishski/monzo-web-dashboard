import type { UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";

import type { Account } from "@/lib/types";
import { fetchAccount } from "@/api/endpoints/account";

export const useGetAccount = (): UseQueryResult<Account> => {
  return useQuery({
    queryKey: ["account"],
    queryFn: fetchAccount,
  });
};
