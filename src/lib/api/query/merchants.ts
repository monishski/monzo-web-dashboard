import type { PgColumn } from "drizzle-orm/pg-core";

import { monzoCategories, monzoMerchantGroups } from "@/lib/db/schema";
import type { MerchantGroup } from "@/lib/types";

import type { ApiQuery } from "./types";
import { createApiQuerySchema } from "./utils";

export type MerchantGroupSortFields = keyof Pick<
  MerchantGroup,
  "name" | "category"
>;
export type MerchantGroupSearchFields = keyof Pick<MerchantGroup, "name">;
export type MerchantGroupNumericFilterFields = never;
export type MerchantGroupDateFilterFields = never;
export type MerchantGroupBooleanFilterFields = never;
export type MerchantGroupStringFilterFields = keyof Pick<
  MerchantGroup,
  "category"
>;

export type MerchantGroupApiQuery = ApiQuery<
  MerchantGroupSortFields[],
  MerchantGroupSearchFields[],
  MerchantGroupNumericFilterFields[],
  MerchantGroupDateFilterFields[],
  MerchantGroupStringFilterFields[],
  MerchantGroupBooleanFilterFields[]
>;

export const MerchantGroupsApiQuerySchema = createApiQuerySchema<
  MerchantGroupSortFields[],
  MerchantGroupSearchFields[],
  MerchantGroupNumericFilterFields[],
  MerchantGroupDateFilterFields[],
  MerchantGroupStringFilterFields[],
  MerchantGroupBooleanFilterFields[]
>({
  sort: ["name", "category"],
  search: ["name"],
  filters: {
    string: ["category"],
  },
});

export const merchantGroupSortFieldMap: Record<
  MerchantGroupSortFields,
  PgColumn
> = {
  name: monzoMerchantGroups.name,
  category: monzoCategories.name,
};

export const merchantGroupSearchFieldMap: Record<
  MerchantGroupSearchFields,
  PgColumn
> = {
  name: monzoMerchantGroups.name,
};

export const merchantGroupStringFilterFieldMap: Record<
  MerchantGroupStringFilterFields,
  PgColumn
> = {
  category: monzoCategories.id,
};
