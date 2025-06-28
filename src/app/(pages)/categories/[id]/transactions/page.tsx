"use server";

import type { JSX } from "react";
import { headers } from "next/headers";

async function CategoryTransactionsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<JSX.Element> {
  const { id } = await params;

  const headersList = await headers();
  const cookie = headersList.get("cookie");

  const transactionsRes = await fetch(
    `http://localhost:3001/api/categories/${id}/transactions`,
    {
      headers: {
        ...(cookie ? { cookie } : {}),
        "Content-Type": "application/json",
      },
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
