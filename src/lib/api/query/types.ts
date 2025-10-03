import type z from "zod";
import type { util } from "zod/v4/core";

export enum SortOrder {
  ASC = "asc",
  DESC = "desc",
}

export type ApiQuery<
  Sort extends readonly string[] = readonly string[],
  Search extends readonly string[] = readonly string[],
  NumberFilter extends readonly string[] = readonly string[],
  DateFilter extends readonly string[] = readonly string[],
  StringFilter extends readonly string[] = readonly string[],
  BooleanFilter extends readonly string[] = readonly string[],
> = {
  page?: number;
  limit?: number;
  sort?: { by: Partial<Sort[number]>; order: "asc" | "desc" }[];
  search?: { by: Partial<Search[number]>; value: string };
  filters?: {
    numeric?: { by: NumberFilter[number]; from: number; to: number }[];
    date?: { by: DateFilter[number]; from: string; to: string }[];
    boolean?: { by: BooleanFilter[number]; value: boolean }[];
    string?: { by: StringFilter[number]; values: string[] }[];
  };
};

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
  sort: z.ZodDefault<
    z.ZodArray<
      z.ZodObject<{
        by: z.ZodEnum<util.ToEnum<Sort[number]>>;
        order: z.ZodEnum<util.ToEnum<SortOrder>>;
      }>
    >
  >;
  search: z.ZodDefault<
    z.ZodNullable<
      z.ZodObject<{
        by: z.ZodEnum<util.ToEnum<Search[number]>>;
        value: z.ZodOptional<z.ZodString>;
      }>
    >
  >;
  filters: z.ZodOptional<
    z.ZodObject<{
      numeric: z.ZodDefault<
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
      date: z.ZodDefault<
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
      boolean: z.ZodDefault<
        z.ZodOptional<
          z.ZodArray<
            z.ZodObject<{
              by: z.ZodEnum<{ [K in BooleanFilter[number]]: K }>;
              value: z.ZodBoolean;
            }>
          >
        >
      >;
      string: z.ZodDefault<
        z.ZodOptional<
          z.ZodArray<
            z.ZodObject<{
              by: z.ZodEnum<{ [K in StringFilter[number]]: K }>;
              values: z.ZodArray<z.ZodString>;
            }>
          >
        >
      >;
    }>
  >;
}>;
