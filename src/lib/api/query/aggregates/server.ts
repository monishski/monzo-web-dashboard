import z from "zod";

import { Period } from "./types";

export const getDefaultDateRangeForPeriod = (
  period?: Period
): { from: string; to: string } => {
  const now = new Date();
  let from = new Date(...[now.getFullYear() - 1, 0, 1, 0, 0, 0, 0]);

  if (period === Period.YEAR) {
    from = new Date(...[now.getFullYear() - 1, 0, 1, 0, 0, 0, 0]);
  } else if (period === Period.MONTH) {
    from = new Date(
      ...[now.getFullYear(), now.getMonth() - 1, 1, 0, 0, 0, 0]
    );
  } else if (period === Period.WEEK) {
    from = new Date(
      ...[now.getFullYear(), now.getMonth(), now.getDate() - 7, 0, 0, 0, 0]
    );
  }

  return { from: from.toISOString(), to: now.toISOString() };
};

const dateSchema = z.object({
  from: z.string().transform((val) => new Date(val).toISOString()),
  to: z.string().transform((val) => new Date(val).toISOString()),
});

const aggregateSchema = {
  date: dateSchema
    .optional()
    .default(() => getDefaultDateRangeForPeriod()),
  categoryIds: z.array(z.string()).optional(),
  merchantGroupIds: z.array(z.string()).optional(),
};

export const TimeSeriesAggregateApiQuerySchema = z
  .object({
    ...aggregateSchema,
    date: dateSchema.optional(),
    period: z.enum(Period),
  })
  .transform((data) => {
    if (!data.date) {
      data.date = getDefaultDateRangeForPeriod(data.period);
    }
    return data;
  });

export const MerchantGroupAggregateApiQuerySchema =
  z.object(aggregateSchema);

export const CategoryAggregateApiQuerySchema = z.object(aggregateSchema);
