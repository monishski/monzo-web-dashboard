"use client";

import { signIn, signOut, useSession } from "@/lib/auth/auth-client";
import Link from "next/link";

export default function Home() {
  const session = useSession();

  return (
    <div className="flex items-start justify-center min-h-screen p-8 flex-col">
      <h1 className="text-4xl font-bold font-[family-name:var(--font-geist-sans)]">
        Better Auth
      </h1>

      <Link href="/transactions">Transactions</Link>

      <Link href="/accounts">Accounts</Link>

      <pre>{JSON.stringify(session, null, 2)}</pre>
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
