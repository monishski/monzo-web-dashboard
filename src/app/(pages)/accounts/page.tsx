"use client";

import { useEffect, useState, type JSX } from "react";

import { ThemeButton } from "@/components/molecules";

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

  return (
    <div>
      <ThemeButton />
      <pre>{JSON.stringify(account, null, 2)}</pre>
    </div>
  );
}
export default AccountsPage;
