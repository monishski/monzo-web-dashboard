"use client";

import type { JSX } from "react";
import { useMemo } from "react";

import { useGetCategoryAggregates } from "@/api/queries";

function CategoryAggregatesPage(): JSX.Element {
  const queryParams = useMemo(
    () => ({
      date: {
        from: new Date(new Date().getFullYear(), 0, 1).toISOString(), // Start of current year
        to: new Date().toISOString(), // Now
      },
    }),
    []
  );

  const {
    data: categoryAggregates,
    isLoading,
    error,
  } = useGetCategoryAggregates(queryParams);

  if (isLoading) return <div>Loading category aggregates...</div>;
  if (error)
    return <div style={{ color: "red" }}>Error: {error.message}</div>;

  return (
    <div>
      <h1>Category Aggregates</h1>
      <pre>{JSON.stringify(categoryAggregates, null, 2)}</pre>
    </div>
  );
}

export default CategoryAggregatesPage;
