"use client";

import type { JSX } from "react";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { parseAsArrayOf, parseAsString, useQueryStates } from "nuqs";
import { DayPicker } from "react-day-picker";

import type { PaginatedData } from "@/lib/api/types";
import type { Category, Transaction } from "@/lib/types";

const DEFAULT_START_DATE = "2025-01-01T00:00:00Z";
const DEFAULT_END_DATE = "2025-12-31T23:59:59Z";

function TransactionsPage(): JSX.Element {
  const [filters, setFilters] = useQueryStates(
    {
      merchantGroupIds: parseAsArrayOf(parseAsString).withDefault([]),
      categoryIds: parseAsArrayOf(parseAsString).withDefault([]),
    },
    {
      history: "push",
    }
  );

  const { merchantGroupIds, categoryIds } = filters;

  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [transactions, setTransactions] =
    useState<PaginatedData<Transaction> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<
    { id: string; name: string }[]
  >([]);
  const [description, setDescription] = useState("");
  const [debouncedDescription, setDebouncedDescription] = useState("");

  // Debounce description input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedDescription(description);
    }, 400);
    return (): void => {
      clearTimeout(handler);
    };
  }, [description]);

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async (): Promise<void> => {
      try {
        const res = await fetch("/api/categories");
        if (!res.ok) throw new Error("Failed to fetch categories");
        const { data: categories } = (await res.json()) as {
          data: Category[];
        };

        setCategories(categories);
      } catch {
        // Optionally handle error
      }
    };
    fetchCategories();
  }, []);

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
            sort: [{ by: "created", order: "desc" }],
            ...(debouncedDescription
              ? {
                  search: {
                    by: "description",
                    value: debouncedDescription,
                  },
                }
              : {}),
            filters: {
              date: [
                {
                  by: "created",
                  from: startDate
                    ? startDate.toISOString()
                    : // TODO: this should be account creation date
                      DEFAULT_START_DATE,
                  to: endDate
                    ? endDate.toISOString()
                    : // TODO: this should be today
                      DEFAULT_END_DATE,
                },
              ],
              ...(merchantGroupIds.length > 0 || categoryIds.length > 0
                ? {
                    string: [
                      ...(merchantGroupIds.length > 0
                        ? [
                            {
                              by: "merchantGroupId",
                              values: merchantGroupIds,
                            },
                          ]
                        : []),
                      ...(categoryIds.length > 0
                        ? [{ by: "categoryId", values: categoryIds }]
                        : []),
                    ],
                  }
                : {}),
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
  }, [
    startDate,
    endDate,
    categoryIds,
    debouncedDescription,
    merchantGroupIds,
  ]);

  // Handler for multi-select
  const handleCategoryChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ): void => {
    const selected = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );
    setFilters({
      ...filters,
      categoryIds: selected,
    });
  };

  const clearMerchantGroupFilter = (): void => {
    setFilters({
      ...filters,
      merchantGroupIds: [],
    });
  };

  // Clear category filter
  const clearCategoryFilter = (): void => {
    setFilters({
      ...filters,
      categoryIds: [],
    });
  };

  // Clear all filters
  const clearAllFilters = (): void => {
    setFilters(null);
  };

  return (
    <div>
      {/* Show merchant group filter if active */}
      {merchantGroupIds.length > 0 && (
        <div className="mb-4 rounded border border-blue-300 bg-blue-100 p-2">
          <span>
            Filtered by merchant groups: {merchantGroupIds.join(", ")}
          </span>
          <button
            onClick={clearMerchantGroupFilter}
            className="ml-2 rounded bg-blue-500 px-2 py-1 text-sm text-white"
          >
            Clear
          </button>
        </div>
      )}

      {/* Show category filter if active */}
      {categoryIds.length > 0 && (
        <div className="mb-4 rounded border border-green-300 bg-green-100 p-2">
          <span>Filtered by categories: {categoryIds.join(", ")}</span>
          <button
            onClick={clearCategoryFilter}
            className="ml-2 rounded bg-green-500 px-2 py-1 text-sm text-white"
          >
            Clear
          </button>
        </div>
      )}

      {/* Clear all filters button */}
      {(merchantGroupIds.length > 0 || categoryIds.length > 0) && (
        <div className="mb-4">
          <button
            onClick={clearAllFilters}
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
          Start Date: {startDate?.toISOString() ?? DEFAULT_START_DATE}
        </label>
        <DayPicker
          mode="single"
          selected={startDate ?? new Date(DEFAULT_START_DATE)}
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
          onChange={handleCategoryChange}
        >
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
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

export default TransactionsPage;
