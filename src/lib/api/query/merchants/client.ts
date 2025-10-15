import type { ApiQuery } from "../types";
import type {
  MerchantGroupBooleanFilterFields,
  MerchantGroupDateFilterFields,
  MerchantGroupNumericFilterFields,
  MerchantGroupSearchFields,
  MerchantGroupSortFields,
  MerchantGroupStringFilterFields,
} from "./types";

export type MerchantGroupApiQuery = ApiQuery<
  MerchantGroupSortFields[],
  MerchantGroupSearchFields[],
  MerchantGroupNumericFilterFields[],
  MerchantGroupDateFilterFields[],
  MerchantGroupStringFilterFields[],
  MerchantGroupBooleanFilterFields[]
>;
