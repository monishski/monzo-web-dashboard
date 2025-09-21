"use client";

import { useGetAccount } from "@/queries/useGetAccount";

export default function AccountsPage(): React.JSX.Element {
  const { data: account, isFetching, isError } = useGetAccount();

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
