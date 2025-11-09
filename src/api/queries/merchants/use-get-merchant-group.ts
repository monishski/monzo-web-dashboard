import type { UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";

import type { MerchantGroup } from "@/lib/types";
import { fetchMerchantGroup } from "@/api/endpoints/client/merchants";

import { merchantsQueryKeys } from "./query-key.factory";

export const useGetMerchantGroup = (
  id: MerchantGroup["id"]
): UseQueryResult<MerchantGroup> =>
  useQuery({
    queryKey: merchantsQueryKeys.merchantGroup(id),
    queryFn: () => fetchMerchantGroup(id),
    enabled: !!id,
  });
