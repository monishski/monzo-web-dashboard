"use server";

import type { JSX } from "react";
import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

async function deleteCategory(id: string): Promise<void> {
  "use server";

  const headersList = await headers();
  const cookie = headersList.get("cookie");

  const response = await fetch(
    `http://localhost:3001/api/categories/${id}`,
    {
      method: "DELETE",
      headers: {
        ...(cookie ? { cookie } : {}),
      },
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error);
  }

  redirect("/categories");
}

async function updateCategory(
  id: string,
  formData: FormData
): Promise<void> {
  "use server";

  const name = formData.get("name");
  if (!name || typeof name !== "string") {
    throw new Error("Name is required");
  }

  const headersList = await headers();
  const cookie = headersList.get("cookie");

  const response = await fetch(
    `http://localhost:3001/api/categories/${id}`,
    {
      method: "PUT",
      headers: {
        ...(cookie ? { cookie } : {}),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name }),
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error);
  }

  redirect("/categories");
}

async function CategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<JSX.Element> {
  const { id } = await params;

  const categoryRes = await fetch(
    `http://localhost:3001/api/categories/${id}`,
    { headers: await headers() }
  );
  if (!categoryRes.ok) {
    const error = await categoryRes.text();
    throw new Error(JSON.stringify(error, null, 2));
  }
  const { data: category } = await categoryRes.json();

  const updateCategoryWithId = updateCategory.bind(null, id);
  const deleteCategoryWithId = deleteCategory.bind(null, id);

  return (
    <div>
      <pre>{JSON.stringify(category, null, 2)}</pre>
      <form action={deleteCategoryWithId}>
        <button type="submit">Delete</button>
      </form>
      <h1>Edit</h1>
      <form action={updateCategoryWithId}>
        <div>
          <label htmlFor="name">Category Name</label>
          <input
            type="text"
            id="name"
            name="name"
            required
            placeholder="Enter category name"
            defaultValue={category.name}
          />
        </div>
        <button type="submit">Update</button>
      </form>
      <Link href={`/transactions?categoryIds=${id}`}>Transactions</Link>
      <Link href={`/merchants?categoryIds=${id}`}>Merchants</Link>
    </div>
  );
}

export default CategoryPage;
