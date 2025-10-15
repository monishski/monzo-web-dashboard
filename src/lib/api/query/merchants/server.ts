import type { PgColumn } from "drizzle-orm/pg-core";

import { monzoCategories, monzoMerchantGroups } from "@/lib/db/schema";

import { createApiQuerySchema } from "../utils";
import type {
  MerchantGroupBooleanFilterFields,
  MerchantGroupDateFilterFields,
  MerchantGroupNumericFilterFields,
  MerchantGroupSearchFields,
  MerchantGroupSortFields,
  MerchantGroupStringFilterFields,
} from "./types";

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
