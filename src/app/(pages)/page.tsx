"use client";

import type { JSX } from "react";
import Link from "next/link";

export default function Home(): JSX.Element {
  return (
    <div className="flex min-h-screen flex-col items-start justify-center gap-2 p-8">
      <h1 className="font-[family-name:var(--font-geist-sans)] text-4xl font-bold">
        Monzo dashboard
      </h1>

      <Link href="/seed">Seed</Link>

      <Link href="/transactions">Transactions</Link>

      <Link href="/accounts">Accounts</Link>

      <Link href="/merchants">Merchants</Link>

      <Link href="/categories">Categories</Link>
    </div>
  );
}
