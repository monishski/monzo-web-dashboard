"use client";

import type { JSX } from "react";
import { Suspense, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { parseAsArrayOf, parseAsString, useQueryStates } from "nuqs";

import { useGetCategories } from "@/api/queries/categories";
import { useGetMerchantGroups } from "@/api/queries/merchants";
import {
  getCategoryUrl,
  getMerchantUrl,
  getTransactionsUrl,
} from "@/routing";

function MerchantsPageContent(): JSX.Element {
  const [filters, setFilters] = useQueryStates(
    { categoryIds: parseAsArrayOf(parseAsString).withDefault([]) },
    { history: "push" }
  );

  const { categoryIds } = filters;

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

  const { data: categories = [] } = useGetCategories();

  // Fetch merchant groups using react-query
  const {
    data: merchantGroups,
    isLoading: loading,
    error,
  } = useGetMerchantGroups({
    page: 1,
    limit: 10,
    ...(debouncedName
      ? { search: { by: "name", value: debouncedName } }
      : {}),
    filters: {
      ...(categoryIds.length > 0
        ? { string: [{ by: "category", values: categoryIds }] }
        : {}),
    },
  });

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
      {error && <div style={{ color: "red" }}>{error.message}</div>}
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
                <Link href={getMerchantUrl(merchantGroup.id)}>
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
                  <Link href={getCategoryUrl(merchantGroup.category.id)}>
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
                    href={getTransactionsUrl({
                      merchantGroupIds: [merchantGroup.id],
                    })}
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

function MerchantsPage(): JSX.Element {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <MerchantsPageContent />
    </Suspense>
  );
}

export default MerchantsPage;
