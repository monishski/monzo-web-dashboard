"use client";

import type { JSX } from "react";

// NOTE: this is for initial fetch of data only
// TODO: syncing of latest transactions (hence the separation of the API routes)
function SeedingPage(): JSX.Element {
  const handleSeed = async (): Promise<void> => {
    const accountResponse = await fetch("/api/monzo/accounts", {
      method: "POST",
    });
    if (!accountResponse.ok) {
      const error = await accountResponse.text();
      throw Error(error);
    }
    const { data: account } = await accountResponse.json();

    const transactionResponse = await fetch("/api/monzo/transactions", {
      method: "POST",
      body: JSON.stringify({ accountId: account.id }),
    });
    if (!transactionResponse.ok) {
      const error = await transactionResponse.text();
      throw Error(error);
    }
  };

  const handleSeedTransactions = async (): Promise<void> => {
    const accountResponse = await fetch("/api/accounts");
    if (!accountResponse.ok) {
      const error = await accountResponse.text();
      throw Error(error);
    }
    const { data: account } = await accountResponse.json();

    const transactionResponse = await fetch("/api/monzo/transactions", {
      method: "POST",
      body: JSON.stringify({
        accountId: account.id,
        accountCreated: account.created,
      }),
    });
    if (!transactionResponse.ok) {
      const error = await transactionResponse.text();
      throw Error(error);
    }
  };

  return (
    <div>
      <button onClick={handleSeed}>Seed data</button>
      <button onClick={handleSeedTransactions}>
        Seed only transactions
      </button>
    </div>
  );
}

export default SeedingPage;
