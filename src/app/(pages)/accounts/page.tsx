"use client";

import { useEffect, useState, type JSX } from "react";

function AccountsPage(): JSX.Element {
  const [account, setAccount] = useState(null);

  useEffect(() => {
    const fetchAccount = async (): Promise<void> => {
      const response = await fetch("/api/accounts");
      if (!response.ok) throw Error("Failed to fetch accounts");
      const { data: account } = await response.json();
      setAccount(account);
    };
    fetchAccount();
  }, [setAccount]);

  const handleSeedAccounts = async (): Promise<void> => {
    const response = await fetch("/api/monzo/accounts", {
      method: "POST",
    });
    if (!response.ok) throw Error("There was error saving accounts");
  };

  return (
    <div>
      <pre>{JSON.stringify(account, null, 2)}</pre>
      <button onClick={handleSeedAccounts}>Seed accounts data</button>
    </div>
  );
}
export default AccountsPage;
