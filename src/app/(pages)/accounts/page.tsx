"use client";

import type { JSX } from "react";

function AccountsPage(): JSX.Element {
  const handleSeedAccounts = async (): Promise<void> => {
    const response = await fetch("/api/monzo/accounts", {
      method: "POST",
    });
    if (!response.ok) throw Error("There was error saving accounts");
  };

  return (
    <div>
      <button onClick={handleSeedAccounts}>Seed accounts data</button>
    </div>
  );
}
export default AccountsPage;
