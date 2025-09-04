import z from "zod";

import type { ApiQuerySchema } from "./types";

export const createApiQuerySchema = <
  Sort extends readonly string[] = readonly string[],
  Search extends readonly string[] = readonly string[],
  NumberFilter extends readonly string[] = readonly string[],
  DateFilter extends readonly string[] = readonly string[],
  StringFilter extends readonly string[] = readonly string[],
  BooleanFilter extends readonly string[] = readonly string[],
>({
  sort,
  search,
  filters,
}: {
  sort?: Sort;
  search?: Search;
  filters?: {
    numeric?: NumberFilter;
    date?: DateFilter;
    string?: StringFilter;
    boolean?: BooleanFilter;
  };
}): ApiQuerySchema<
  Sort,
  Search,
  NumberFilter,
  DateFilter,
  StringFilter,
  BooleanFilter
> => {
  return z.object({
    page: z.number().min(1).default(1),
    limit: z.number().min(1).max(100).default(20),
    sort: z
      .array(
        z.object({
          by: z.enum(sort ?? ([] as unknown as Sort)),
          order: z.enum(["asc", "desc"]),
        })
      )
      .default([]),
    search: z
      .object({
        by: z.enum(search ?? ([] as unknown as Search)),
        value: z.string().min(1).max(100).optional(),
      })
      .nullable()
      .default(null),
    filters: z
      .object({
        numeric: z
          .array(
            z.object({
              by: z.enum(
                filters?.numeric ?? ([] as unknown as NumberFilter)
              ),
              from: z.number(),
              to: z.number(),
            })
          )
          .optional()
          .default([]),
        boolean: z
          .array(
            z.object({
              by: z.enum(
                filters?.boolean ?? ([] as unknown as BooleanFilter)
              ),
              value: z.boolean(),
            })
          )
          .optional()
          .default([]),
        date: z
          .array(
            z.object({
              by: z.enum(filters?.date ?? ([] as unknown as DateFilter)),
              from: z
                .string()
                .transform((val) => new Date(val).toISOString()),
              to: z
                .string()
                .transform((val) => new Date(val).toISOString()),
            })
          )
          .optional()
          .default([]),
        string: z
          .array(
            z.object({
              by: z.enum(
                filters?.string ?? ([] as unknown as StringFilter)
              ),
              values: z.array(z.string()),
            })
          )
          .optional()
          .default([]),
      })
      .optional(),
  });
};
