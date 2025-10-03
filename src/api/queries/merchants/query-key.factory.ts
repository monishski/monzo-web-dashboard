import type { MerchantGroupApiQuery } from "@/lib/api";
import type { MerchantGroup } from "@/lib/types";

export const BASE_QUERY_KEY = "merchants"; // TODO: This should be based on Client-Server types, NOT Server-DB

export const merchantsQueryKeys = {
  all: [BASE_QUERY_KEY] as const,
  merchantGroups: (query?: MerchantGroupApiQuery) =>
    [BASE_QUERY_KEY, "merchant-groups", query] as const,
  merchantGroup: (id: MerchantGroup["id"]) =>
    [BASE_QUERY_KEY, "merchant-group", id] as const,
};
