import type { MerchantGroupApiQuery } from "@/lib/api/query/merchants/client";
import type { PaginatedData } from "@/lib/api/types/response";
import type { Category, MerchantGroup } from "@/lib/types";

import { apiHttpClient } from "./client";

export const fetchMerchantGroups = async (
  query: MerchantGroupApiQuery
): Promise<PaginatedData<MerchantGroup>> =>
  await apiHttpClient.post({
    url: "/merchants",
    payload: query,
  });

export const fetchMerchantGroup = async (
  id: MerchantGroup["id"]
): Promise<MerchantGroup> =>
  await apiHttpClient.get({
    url: `/merchants/${id}`,
  });

export const updateMerchantGroup = async (
  id: MerchantGroup["id"],
  payload: { categoryId: Category["id"] }
): Promise<MerchantGroup> =>
  await apiHttpClient.put({
    url: `/merchants/${id}`,
    payload,
  });
