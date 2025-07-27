import type { JSX } from "react";
import { headers } from "next/headers";
import Image from "next/image";
import Link from "next/link";

import type { PaginatedData } from "@/lib/api/types";
import type { Transaction } from "@/lib/types";

async function TransactionsPage(): Promise<
  Promise<Promise<Promise<JSX.Element>>>
> {
  const headersList = await headers();
  const cookie = headersList.get("cookie");

  const response = await fetch("http://localhost:3001/api/transactions", {
    method: "POST",
    headers: {
      ...(cookie ? { cookie } : {}),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      page: 1,
      limit: 10,
      sort: [{ by: "created", order: "asc" }],
      search: { by: "description", value: "uber" },
      filters: {
        date: [
          {
            by: "created",
            from: "2025-01-01T00:00:00Z",
            to: "2025-12-31T23:59:59Z",
          },
        ],
        string: [
          {
            by: "categoryId",
            values: ["eating_out"],
          },
        ],
      },
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw Error(JSON.stringify({ error }, null, 2));
  }

  const { data: transactions } = (await response.json()) as {
    data: PaginatedData<Transaction>;
  };

  return (
    <table>
      <thead>
        <tr>
          <th>Description</th>
          <th>Amount</th>
          <th>Created</th>
          <th>Settled</th>
          <th>Category Name</th>
          <th>Merchant</th>
          <th>Merchant Address</th>
          <th>Notes</th>
        </tr>
      </thead>
      <tbody>
        {transactions?.data?.map((tx) => (
          <tr key={tx.id}>
            <td>{tx.description}</td>
            <td>{tx.amount / 100}</td>
            <td>{tx.created}</td>
            <td>{tx.settled}</td>
            <td>
              {tx.category?.id ? (
                <Link href={`/categories/${tx.category.id}`}>
                  {tx.category?.name ?? ""}
                </Link>
              ) : (
                "No category"
              )}
            </td>
            <td>
              {tx.merchantGroup?.id ? (
                <Link href={`/merchants/${tx.merchantGroup.id}`}>
                  <div className="flex flex-nowrap items-center gap-2">
                    {tx.merchantGroup?.logo && (
                      <Image
                        src={tx.merchantGroup.logo}
                        width={32}
                        height={32}
                        alt={`${tx.merchantGroup?.name} logo`}
                      />
                    )}
                    <span>{tx.merchantGroup?.name}</span>
                    {tx.merchantGroup?.emoji ?? ""}
                  </div>
                </Link>
              ) : (
                "No category"
              )}
            </td>
            <td>{tx.merchant?.address?.formatted ?? ""}</td>
            <td>{tx.notes}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default TransactionsPage;
