"use client";

import type { JSX } from "react";
import Link from "next/link";

import { useGetCategories } from "@/api/queries/categories";

function CategoriesPage(): JSX.Element {
  const { data: categories, isLoading, error } = useGetCategories();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <Link href="/categories/create">Create new category</Link>

      {categories &&
        categories.length > 0 &&
        categories.map((category) => (
          <div key={category.id}>
            <pre>{JSON.stringify(category, null, 2)}</pre>
            <Link href={`/categories/${category.id}`}>
              {category.name}
            </Link>
          </div>
        ))}
    </div>
  );
}

export default CategoriesPage;
