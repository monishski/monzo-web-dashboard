import type { MerchantGroupApiQuery } from "@/lib/api/query/merchants/client";
import type { MerchantGroup } from "@/lib/types";

export const BASE_QUERY_KEY = "merchants";

export const merchantsQueryKeys = {
  all: [BASE_QUERY_KEY] as const,
  merchantGroups: (query?: MerchantGroupApiQuery) =>
    [BASE_QUERY_KEY, query] as const,
  merchantGroup: (id: MerchantGroup["id"]) =>
    [BASE_QUERY_KEY, id] as const,
};
