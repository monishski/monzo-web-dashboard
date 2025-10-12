"use client";

import type { JSX } from "react";
import { Suspense, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { parseAsArrayOf, parseAsString, useQueryStates } from "nuqs";
import { DayPicker } from "react-day-picker";

import { useGetAccount } from "@/api/queries/account/use-get-account";
import { useGetCategories } from "@/api/queries/categories";
import { useGetTransactions } from "@/api/queries/transactions";

const DEFAULT_END_DATE = new Date().toISOString();

function TransactionsPageContent(): JSX.Element {
  const [filters, setFilters] = useQueryStates(
    {
      merchantGroupIds: parseAsArrayOf(parseAsString).withDefault([]),
      categoryIds: parseAsArrayOf(parseAsString).withDefault([]),
    },
    { history: "push" }
  );

  const { merchantGroupIds, categoryIds } = filters;

  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [description, setDescription] = useState("");
  const [debouncedDescription, setDebouncedDescription] = useState("");

  const { data: account, isLoading: accountLoading } = useGetAccount();
  const { data: categories = [] } = useGetCategories();

  const queryParams = useMemo(() => {
    const now = new Date().toISOString();
    const fromDate = startDate
      ? startDate.toISOString()
      : account?.created || now;
    const toDate = endDate ? endDate.toISOString() : now;

    return {
      sort: [{ by: "created" as const, order: "desc" as const }],
      ...(debouncedDescription
        ? {
            search: {
              by: "description" as const,
              value: debouncedDescription,
            },
          }
        : {}),
      filters: {
        date: [{ by: "created" as const, from: fromDate, to: toDate }],
        ...(merchantGroupIds.length > 0 || categoryIds.length > 0
          ? {
              string: [
                ...(merchantGroupIds.length > 0
                  ? [
                      {
                        by: "merchantGroup" as const,
                        values: merchantGroupIds,
                      },
                    ]
                  : []),
                ...(categoryIds.length > 0
                  ? [{ by: "category" as const, values: categoryIds }]
                  : []),
              ],
            }
          : {}),
      },
    };
  }, [
    startDate,
    endDate,
    account?.created,
    debouncedDescription,
    merchantGroupIds,
    categoryIds,
  ]);

  const {
    data: transactions,
    isLoading: loading,
    error,
  } = useGetTransactions(queryParams);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedDescription(description);
    }, 400);
    return (): void => {
      clearTimeout(handler);
    };
  }, [description]);

  return (
    <div>
      {merchantGroupIds.length > 0 && (
        <div className="mb-4 rounded border border-blue-300 bg-blue-100 p-2">
          <span>
            Filtered by merchant groups: {merchantGroupIds.join(", ")}
          </span>
          <button
            onClick={(): void => {
              setFilters({ ...filters, merchantGroupIds: [] });
            }}
            className="ml-2 rounded bg-blue-500 px-2 py-1 text-sm text-white"
          >
            Clear
          </button>
        </div>
      )}

      {categoryIds.length > 0 && (
        <div className="mb-4 rounded border border-green-300 bg-green-100 p-2">
          <span>Filtered by categories: {categoryIds.join(", ")}</span>
          <button
            onClick={(): void => {
              setFilters({ ...filters, categoryIds: [] });
            }}
            className="ml-2 rounded bg-green-500 px-2 py-1 text-sm text-white"
          >
            Clear
          </button>
        </div>
      )}

      {(merchantGroupIds.length > 0 || categoryIds.length > 0) && (
        <div className="mb-4">
          <button
            onClick={(): void => {
              setFilters(null);
            }}
            className="rounded bg-gray-500 px-3 py-1 text-sm text-white"
          >
            Clear All Filters
          </button>
        </div>
      )}

      <div>
        <label htmlFor="description-input">Description: </label>
        <input
          id="description-input"
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Filter by description"
        />
      </div>
      <div>
        <label>
          Start Date:{" "}
          {startDate?.toISOString() ?? account?.created ?? "Loading..."}
        </label>
        <DayPicker
          mode="single"
          selected={
            startDate ??
            (account?.created ? new Date(account.created) : new Date())
          }
          onSelect={setStartDate}
        />
      </div>
      <div>
        <label>
          End Date: {endDate?.toISOString() ?? DEFAULT_END_DATE}
        </label>
        <DayPicker
          mode="single"
          selected={endDate ?? new Date(DEFAULT_END_DATE)}
          onSelect={setEndDate}
        />
      </div>
      <div>
        <label>Categories:</label>
        <select
          multiple
          value={categoryIds}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>): void => {
            const selected = Array.from(
              e.target.selectedOptions,
              (option) => option.value
            );
            setFilters({ ...filters, categoryIds: selected });
          }}
        >
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>
      {accountLoading && <div>Loading account...</div>}
      {loading && <div>Loading transactions...</div>}
      {error && <div style={{ color: "red" }}>{error.message}</div>}
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
              <td>
                <Link href={`/transactions/${tx.id}`}>
                  {tx.description}
                </Link>
              </td>
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
                  "No merchant"
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

function TransactionsPage(): JSX.Element {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TransactionsPageContent />
    </Suspense>
  );
}

export default TransactionsPage;
