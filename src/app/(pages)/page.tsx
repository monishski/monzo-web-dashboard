"use client";

import type { JSX } from "react";
import Link from "next/link";

import {
  getAccountsUrl,
  getCategoriesUrl,
  getMerchantsUrl,
  getSeedUrl,
  getTransactionsUrl,
} from "@/routing";

export default function Home(): JSX.Element {
  return (
    <div className="flex min-h-screen flex-col items-start justify-center gap-2 p-8">
      <h1 className="font-[family-name:var(--font-geist-sans)] text-4xl font-bold">
        Monzo dashboard
      </h1>

      <Link href={getSeedUrl()}>Seed</Link>

      <Link href={getTransactionsUrl()}>Transactions</Link>

      <Link href={getAccountsUrl()}>Accounts</Link>

      <Link href={getMerchantsUrl()}>Merchants</Link>

      <Link href={getCategoriesUrl()}>Categories</Link>
    </div>
  );
}
