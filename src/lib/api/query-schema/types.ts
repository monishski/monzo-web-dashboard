import type z from "zod";
import type { util } from "zod/v4/core";

export type SortSchema<
  Sort extends readonly string[] = readonly string[],
> = z.ZodDefault<
  z.ZodArray<
    z.ZodObject<{
      by: z.ZodEnum<util.ToEnum<Sort[number]>>;
      order: z.ZodEnum<{ asc: "asc"; desc: "desc" }>;
    }>
  >
>;

export type SearchSchema<
  Search extends readonly string[] = readonly string[],
> = z.ZodDefault<
  z.ZodNullable<
    z.ZodObject<{
      by: z.ZodEnum<util.ToEnum<Search[number]>>;
      value: z.ZodOptional<z.ZodString>;
    }>
  >
>;

export type NumericFilterSchema<
  NumberFilter extends readonly string[] = readonly string[],
> = z.ZodDefault<
  z.ZodOptional<
    z.ZodArray<
      z.ZodObject<{
        by: z.ZodEnum<{ [K in NumberFilter[number]]: K }>;
        from: z.ZodNumber;
        to: z.ZodNumber;
      }>
    >
  >
>;

export type BooleanFilterSchema<
  BooleanFilter extends readonly string[] = readonly string[],
> = z.ZodDefault<
  z.ZodOptional<
    z.ZodArray<
      z.ZodObject<{
        by: z.ZodEnum<{ [K in BooleanFilter[number]]: K }>;
        value: z.ZodBoolean;
      }>
    >
  >
>;

export type DateFilterSchema<
  DateFilter extends readonly string[] = readonly string[],
> = z.ZodDefault<
  z.ZodOptional<
    z.ZodArray<
      z.ZodObject<{
        by: z.ZodEnum<{ [K in DateFilter[number]]: K }>;
        from: z.ZodPipe<z.ZodString, z.ZodTransform<string, string>>;
        to: z.ZodPipe<z.ZodString, z.ZodTransform<string, string>>;
      }>
    >
  >
>;

export type StringFilterSchema<
  StringFilter extends readonly string[] = readonly string[],
> = z.ZodDefault<
  z.ZodOptional<
    z.ZodArray<
      z.ZodObject<{
        by: z.ZodEnum<{ [K in StringFilter[number]]: K }>;
        values: z.ZodArray<z.ZodString>;
      }>
    >
  >
>;

export type FiltersSchema<
  NumberFilter extends readonly string[] = readonly string[],
  DateFilter extends readonly string[] = readonly string[],
  StringFilter extends readonly string[] = readonly string[],
  BooleanFilter extends readonly string[] = readonly string[],
> = z.ZodOptional<
  z.ZodObject<{
    numeric: NumericFilterSchema<NumberFilter>;
    boolean: BooleanFilterSchema<BooleanFilter>;
    date: DateFilterSchema<DateFilter>;
    string: StringFilterSchema<StringFilter>;
  }>
>;

export type ApiQuerySchema<
  Sort extends readonly string[] = readonly string[],
  Search extends readonly string[] = readonly string[],
  NumberFilter extends readonly string[] = readonly string[],
  DateFilter extends readonly string[] = readonly string[],
  StringFilter extends readonly string[] = readonly string[],
  BooleanFilter extends readonly string[] = readonly string[],
> = z.ZodObject<{
  page: z.ZodDefault<z.ZodNumber>;
  limit: z.ZodDefault<z.ZodNumber>;
  sort: SortSchema<Sort>;
  search: SearchSchema<Search>;
  filters: FiltersSchema<
    NumberFilter,
    DateFilter,
    StringFilter,
    BooleanFilter
  >;
}>;
