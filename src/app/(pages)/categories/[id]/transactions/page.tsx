"use server";

import type { JSX } from "react";
import { headers } from "next/headers";

async function CategoryTransactionsPage({
  params,
}: {
  params: { id: string };
}): Promise<JSX.Element> {
  const { id } = await params;

  const headersList = await headers();
  const cookie = headersList.get("cookie");

  const accountRes = await fetch("http://localhost:3001/api/accounts", {
    headers: headersList,
  });
  if (!accountRes.ok) {
    const error = await accountRes.text();
    throw new Error(JSON.stringify(error, null, 2));
  }
  const { data: account } = await accountRes.json();
  if (!account) {
    throw new Error("No account found");
  }

  const transactionsRes = await fetch(
    `http://localhost:3001/api/categories/${id}/transactions`,
    {
      method: "POST",
      headers: {
        ...(cookie ? { cookie } : {}),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ accountId: account.id }),
    }
  );
  if (!transactionsRes.ok) {
    const error = await transactionsRes.text();
    throw new Error(JSON.stringify(error, null, 2));
  }
  const { data: transactions } = await transactionsRes.json();

  return (
    <div>
      <pre>{JSON.stringify(transactions, null, 2)}</pre>
    </div>
  );
}

export default CategoryTransactionsPage;
