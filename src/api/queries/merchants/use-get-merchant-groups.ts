import type { UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";

import type { MerchantGroupApiQuery } from "@/lib/api/query/merchants/client";
import type { PaginatedData } from "@/lib/api/types/response";
import type { MerchantGroup } from "@/lib/types";
import { fetchMerchantGroups } from "@/api/endpoints/merchants";

import { merchantsQueryKeys } from "./query-key.factory";

export const useGetMerchantGroups = (
  query: MerchantGroupApiQuery
): UseQueryResult<PaginatedData<MerchantGroup>> =>
  useQuery({
    queryKey: merchantsQueryKeys.merchantGroups(query),
    queryFn: () => fetchMerchantGroups(query),
  });
