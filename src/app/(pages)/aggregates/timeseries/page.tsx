"use client";

import type { JSX } from "react";
import { useMemo } from "react";

import { Period } from "@/lib/api/query/aggregates/types";
import { useGetTimeSeriesAggregates } from "@/api/queries";

function TimeSeriesAggregatesPage(): JSX.Element {
  const queryParams = useMemo(
    () => ({
      period: Period.MONTH,
      date: {
        from: new Date(new Date().getFullYear() - 1, 0, 1).toISOString(), // Start of current year
        to: new Date().toISOString(), // Now
      },
    }),
    []
  );

  const {
    data: timeSeriesAggregates,
    isLoading,
    error,
  } = useGetTimeSeriesAggregates(queryParams);

  if (isLoading) return <div>Loading timeseries aggregates...</div>;
  if (error)
    return <div style={{ color: "red" }}>Error: {error.message}</div>;

  return (
    <div>
      <h1>TimeSeries Aggregates (Monthly)</h1>
      <pre>{JSON.stringify(timeSeriesAggregates, null, 2)}</pre>
    </div>
  );
}

export default TimeSeriesAggregatesPage;
