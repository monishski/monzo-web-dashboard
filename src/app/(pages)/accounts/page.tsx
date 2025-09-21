"use client";

import { useAccount } from "@/queries/useAccount";

export default function AccountsPage(): React.JSX.Element {
  const { data: account, isFetching, isError } = useAccount();

  return (
    <div>
      {isFetching && <p>Loading...</p>}
      {isError && <p>Error fetching account</p>}
      {!isFetching && !isError && !account && <p>No account found</p>}
      {!isFetching && !isError && account && (
        <pre>{JSON.stringify(account, null, 2)}</pre>
      )}
    </div>
  );
}
