import type { MerchantGroup } from "@/lib/types";

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
