import type { JSX } from "react";
import { headers } from "next/headers";
import Link from "next/link";

import type { Category } from "@/lib/types";

async function CategoriesPage(): Promise<JSX.Element> {
  const response = await fetch("http://localhost:3001/api/categories", {
    headers: await headers(),
  });
  if (!response.ok) {
    const error = await response.text();
    throw new Error(JSON.stringify(error, null, 2));
  }
  const { data: categories } = (await response.json()) as {
    data: Category[];
  };

  return (
    <div>
      <Link href="/categories/create">Create new category</Link>

      {categories.length > 0 &&
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
