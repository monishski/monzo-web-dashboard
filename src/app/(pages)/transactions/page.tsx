"use client";

import type { JSX } from "react";

function TransactionsPage(): JSX.Element {
  const handleSeedTransactions = async (): Promise<void> => {
    const accountResponse = await fetch("/api/monzo/accounts");
    if (!accountResponse.ok) throw Error("Failed to fetch account");
    const { account } = await accountResponse.json();

    const transactionResponse = await fetch("/api/monzo/transactions", {
      method: "POST",
      body: JSON.stringify({ accountId: account.id }),
    });
    if (!transactionResponse.ok)
      throw Error("Failed to seed transaction data");
  };

  return (
    <div>
      <button onClick={handleSeedTransactions}>
        Seed transactions data
      </button>
    </div>
  );
}

export default TransactionsPage;
