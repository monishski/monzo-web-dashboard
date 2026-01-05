"use client";

import type { JSX } from "react";
import { useCallback, useMemo, useState } from "react";
import dayjs from "dayjs";
import { Calendar as CalendarIcon } from "lucide-react";
import type { DateRange } from "react-day-picker";

import { Period } from "@/lib/api/query/aggregates/types";
import { useGetTimeSeriesAggregates } from "@/api/queries";
import { useGetAccount } from "@/api/queries/account";
import { Button } from "@/components/atoms/button";
import { Calendar } from "@/components/atoms/calendar";
import { Stack } from "@/components/atoms/flex";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/atoms/popover";

function formatDateRange(range: DateRange | undefined): string {
  if (!range?.from) return "Select date range";
  const fromStr = dayjs(range.from).format("MMM D, YYYY");
  if (!range.to) return fromStr;
  const toStr = dayjs(range.to).format("MMM D, YYYY");
  return `${fromStr} - ${toStr}`;
}

function TimeSeriesAggregatesPage(): JSX.Element {
  const { data: account } = useGetAccount();

  const accountCreatedDate = useMemo(
    () => (account?.created ? new Date(account.created) : undefined),
    [account?.created]
  );

  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange | undefined>(
    () => ({
      from: dayjs().subtract(1, "year").toDate(),
      to: new Date(),
    })
  );

  const handleCalendarSelect = useCallback(
    (range: DateRange | undefined) => {
      setDateRange(range);
    },
    []
  );

  const queryParams = useMemo(() => {
    return {
      period: Period.MONTH,
      date: {
        from: dateRange?.from?.toISOString() ?? new Date().toISOString(),
        to: dateRange?.to?.toISOString() ?? new Date().toISOString(),
      },
    };
  }, [dateRange]);

  const { data: timeSeriesAggregates, isLoading } =
    useGetTimeSeriesAggregates(queryParams);

  return (
    <Stack justify="start" align="start">
      <h1 className="text-2xl font-semibold">TimeSeries Aggregates</h1>

      <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
        <PopoverTrigger asChild>
          <Button active={isCalendarOpen} size="sm" variant="outline">
            {formatDateRange(dateRange)}
            <CalendarIcon />
          </Button>
        </PopoverTrigger>

        <PopoverContent align="end" className="w-fit p-0">
          <Calendar
            mode="range"
            defaultMonth={dateRange?.to}
            selected={dateRange}
            onSelect={handleCalendarSelect}
            numberOfMonths={2}
            disabled={{
              before: accountCreatedDate,
              after: new Date(),
            }}
            startMonth={accountCreatedDate}
            endMonth={new Date()}
          />
        </PopoverContent>
      </Popover>

      {isLoading && <div>Loading timeseries aggregates...</div>}
      {timeSeriesAggregates && (
        <pre>{JSON.stringify(timeSeriesAggregates, null, 2)}</pre>
      )}
    </Stack>
  );
}

export default TimeSeriesAggregatesPage;
