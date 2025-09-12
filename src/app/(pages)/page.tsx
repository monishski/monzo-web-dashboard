"use client";

import type { JSX } from "react";
import Link from "next/link";

import { signIn, signOut /*, useSession*/ } from "@/lib/auth/auth-client";

import { ThemeToggle } from "./theme-toggle";

export default function Home(): JSX.Element {
  // const session = useSession();

  return (
    <div className="flex min-h-screen flex-col items-start justify-center gap-2 p-8">
      <h1 className="font-[family-name:var(--font-geist-sans)] text-4xl font-bold">
        Monzo dashboard
      </h1>

      <div className="bg-info text-overlay rounded-full px-3 py-0.5">
        Badge
      </div>

      <ThemeToggle />

      <Link href="/seed">Seed</Link>

      <Link href="/transactions">Transactions</Link>

      <Link href="/accounts">Accounts</Link>

      <Link href="/merchants">Merchants</Link>

      <Link href="/categories">Categories</Link>

      {/* <pre>{JSON.stringify(session, null, 2)}</pre> */}
      <button
        onClick={async (e) => {
          e.preventDefault();
          await signIn.oauth2({
            providerId: "monzo",
            callbackURL: "/",
          });
        }}
      >
        Sign in with Monzo
      </button>
      <button
        onClick={async (e) => {
          e.preventDefault();
          await signOut();
        }}
      >
        Sign out
      </button>
    </div>
  );
}
