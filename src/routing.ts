import qs from "qs";

import type { Category, MerchantGroup, Transaction } from "@/lib/types";

export const getHomeUrl = (): string => "/";

export const getLoginUrl = (): string => "/login";

export const getSeedUrl = (): string => "/seed";

export const getAccountsUrl = (): string => "/accounts";

export const getTransactionUrl = (id: Transaction["id"]): string =>
  `/transactions/${id}`;

export const getTransactionsUrl = (queryParams?: {
  merchantGroupIds?: MerchantGroup["id"][];
  categoryIds?: Category["id"][];
}): string => {
  const queryString = qs.stringify(queryParams, {
    arrayFormat: "repeat",
    skipNulls: true,
  });

  return `/transactions?${queryString}`;
};

export const getMerchantUrl = (id: MerchantGroup["id"]): string =>
  `/merchants/${id}`;

export const getMerchantsUrl = (queryParams?: {
  categoryIds?: Category["id"][];
}): string => {
  const queryString = qs.stringify(queryParams, {
    arrayFormat: "repeat",
    skipNulls: true,
  });

  return `/merchants?${queryString}`;
};

export const getCategoryUrl = (id: Category["id"]): string =>
  `/categories/${id}`;

export const getCategoriesUrl = (): string => "/categories";

export const getCreateCategoryUrl = (): string => "/categories/create";
