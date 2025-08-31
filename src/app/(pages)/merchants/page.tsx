"use client";

import type { JSX } from "react";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { parseAsArrayOf, parseAsString, useQueryStates } from "nuqs";

import type { PaginatedData } from "@/lib/api/types";
import type { Category, MerchantGroup } from "@/lib/types";

function MerchantsPage(): JSX.Element {
  const [filters, setFilters] = useQueryStates(
    {
      categoryIds: parseAsArrayOf(parseAsString).withDefault([]),
    },
    {
      history: "push",
    }
  );

  const { categoryIds } = filters;

  const [merchantGroups, setMerchantGroups] =
    useState<PaginatedData<MerchantGroup> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<
    { id: string; name: string }[]
  >([]);
  const [name, setName] = useState("");
  const [debouncedName, setDebouncedName] = useState("");

  // Debounce name input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedName(name);
    }, 400);
    return (): void => {
      clearTimeout(handler);
    };
  }, [name]);

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
    const fetchMerchantGroups = async (): Promise<void> => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch("/api/merchants", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            page: 1,
            limit: 10,
            // sort: [{ by: "name", order: "asc" }],
            ...(debouncedName
              ? {
                  search: {
                    by: "name",
                    value: debouncedName,
                  },
                }
              : {}),
            filters: {
              ...(categoryIds.length > 0
                ? {
                    string: [
                      {
                        by: "category",
                        values: categoryIds,
                      },
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
          data: PaginatedData<MerchantGroup>;
        };
        setMerchantGroups(data);
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
    fetchMerchantGroups();
  }, [debouncedName, categoryIds]);

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
      {categoryIds.length > 0 && (
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
        <label htmlFor="name-input">Name: </label>
        <input
          id="name-input"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Filter by merchant group name"
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
      {merchantGroups?.pagination.total && (
        <div>Total: {merchantGroups.pagination.total}</div>
      )}
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Logo</th>
            <th>Emoji</th>
            <th>Category</th>
            <th>Merchants Count</th>
            <th>Transactions Count</th>
            <th>ATM</th>
            <th>Online</th>
            <th>Last transaction date</th>
          </tr>
        </thead>
        <tbody>
          {merchantGroups?.data?.map((merchantGroup) => (
            <tr key={merchantGroup.id}>
              <td>
                <Link href={`/merchants/${merchantGroup.id}`}>
                  {merchantGroup.name}
                </Link>
              </td>
              <td>
                {merchantGroup.logo && (
                  <Image
                    src={merchantGroup.logo}
                    width={32}
                    height={32}
                    alt={`${merchantGroup.name} logo`}
                  />
                )}
              </td>
              <td>{merchantGroup.emoji}</td>
              <td>
                {merchantGroup.category?.id ? (
                  <Link href={`/categories/${merchantGroup.category.id}`}>
                    {merchantGroup.category.name}
                  </Link>
                ) : (
                  "No category"
                )}
              </td>
              <td>{merchantGroup.merchants?.length || 0}</td>
              <td>
                {merchantGroup.transactionsCount ? (
                  <Link
                    href={`/transactions?merchantGroupIds=${merchantGroup.id}`}
                    className="text-blue-500 hover:underline"
                  >
                    {merchantGroup.transactionsCount}
                  </Link>
                ) : (
                  "0"
                )}
              </td>
              <td>{merchantGroup.atm ? "Yes" : "No"}</td>
              <td>
                {merchantGroup.merchants?.some((m) => m.online)
                  ? "Yes"
                  : "No"}
              </td>

              <td>{merchantGroup.lastTransactionDate}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default MerchantsPage;
