"use client";

import type { JSX } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";

import { signOut } from "@/lib/auth/auth-client";
import { Button } from "@/components/atoms/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/atoms/popover";
import {
  getAccountsUrl,
  getCategoriesUrl,
  getCategoryAggregatesUrl,
  getMerchantGroupAggregatesUrl,
  getMerchantsUrl,
  getSeedUrl,
  getTimeSeriesAggregatesUrl,
  getTransactionsUrl,
} from "@/routing";

const ThemeButton = dynamic(
  () =>
    import("@/components/molecules/theme-button").then(
      (module) => module.ThemeButton
    ),
  { ssr: false }
);

export default function Home(): JSX.Element {
  return (
    <div className="flex min-h-screen flex-col items-start justify-center gap-2 p-8">
      <h1 className="font-[family-name:var(--font-geist-sans)] text-4xl font-bold">
        Monzo dashboard
      </h1>

      <ThemeButton />

      {/* Popover Example */}
      <div className="my-4 flex gap-4">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline">Open Popover</Button>
          </PopoverTrigger>
          <PopoverContent>
            <div className="space-y-2">
              <h3 className="font-semibold">Default Popover</h3>
              <p className="text-muted-foreground text-sm">
                This is a popover with the default medium width. You can
                place any content here.
              </p>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      <Link href={getSeedUrl()}>Seed</Link>

      <Link href={getTransactionsUrl()}>Transactions</Link>

      <Link href={getAccountsUrl()}>Accounts</Link>

      <Link href={getMerchantsUrl()}>Merchants</Link>

      <Link href={getCategoriesUrl()}>Categories</Link>

      <h2 className="mt-4 text-2xl font-semibold">Aggregates</h2>

      <Link href={getCategoryAggregatesUrl()}>Category Aggregates</Link>

      <Link href={getMerchantGroupAggregatesUrl()}>
        Merchant Group Aggregates
      </Link>

      <Link href={getTimeSeriesAggregatesUrl()}>
        TimeSeries Aggregates
      </Link>

      <button onClick={() => signOut()}>Sign out</button>
    </div>
  );
}
