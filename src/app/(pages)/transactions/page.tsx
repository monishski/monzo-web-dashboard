"use client";

import type { JSX } from "react";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { DayPicker } from "react-day-picker";

import type { PaginatedData } from "@/lib/api/types";
import type { Transaction } from "@/lib/types";

function TransactionsPage(): JSX.Element {
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [transactions, setTransactions] =
    useState<PaginatedData<Transaction> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTransactions = async (): Promise<void> => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch("/api/transactions", {
          method: "POST",
          headers: {
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
                  from: startDate
                    ? startDate.toISOString()
                    : // TODO: this should be account creation date
                      "2025-01-01T00:00:00Z",
                  to: endDate
                    ? endDate.toISOString()
                    : // TODO: this should be today
                      "2025-12-31T23:59:59Z",
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
        const { data } = (await response.json()) as {
          data: PaginatedData<Transaction>;
        };
        setTransactions(data);
      } catch (err: unknown) {
        let message = "Unknown error";
        if (
          typeof err === "object" &&
          err &&
          "message" in err &&
          typeof (err as { message?: unknown }).message === "string"
        ) {
          message = (err as { message: string }).message;
        }
        setError(message);
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, [startDate, endDate]);

  return (
    <div>
      <div>
        <label>Start Date:</label>
        <DayPicker
          mode="single"
          selected={startDate}
          onSelect={setStartDate}
        />
      </div>
      <div>
        <label>End Date:</label>
        <DayPicker
          mode="single"
          selected={endDate}
          onSelect={setEndDate}
        />
      </div>
      {loading && <div>Loading...</div>}
      {error && <div style={{ color: "red" }}>{error}</div>}
      {transactions?.pagination.total}
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
    </div>
  );
}

export default TransactionsPage;
