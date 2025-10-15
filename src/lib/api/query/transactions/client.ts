import type { ApiQuery } from "../types";
import type {
  TransactionBooleanFilterFields,
  TransactionDateFilterFields,
  TransactionNumericFilterFields,
  TransactionSearchFields,
  TransactionSortFields,
  TransactionStringFilterFields,
} from "./types";

export type TransactionApiQuery = ApiQuery<
  TransactionSortFields[],
  TransactionSearchFields[],
  TransactionNumericFilterFields[],
  TransactionDateFilterFields[],
  TransactionStringFilterFields[],
  TransactionBooleanFilterFields[]
>;
