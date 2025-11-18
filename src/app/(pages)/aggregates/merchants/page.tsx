"use client";

import type { JSX } from "react";
import { useMemo } from "react";

import { useGetMerchantGroupAggregates } from "@/api/queries";

function MerchantGroupAggregatesPage(): JSX.Element {
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
    data: merchantGroupAggregates,
    isLoading,
    error,
  } = useGetMerchantGroupAggregates(queryParams);

  if (isLoading) return <div>Loading merchant group aggregates...</div>;
  if (error)
    return <div style={{ color: "red" }}>Error: {error.message}</div>;

  return (
    <div>
      <h1>Merchant Group Aggregates</h1>
      <pre>{JSON.stringify(merchantGroupAggregates, null, 2)}</pre>
    </div>
  );
}

export default MerchantGroupAggregatesPage;
