"use server";

import type { JSX } from "react";
import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

import type { Category } from "@/lib/types";

async function updateMerchantGroupCategory(
  id: string,
  formData: FormData
): Promise<void> {
  "use server";

  const categoryId = formData.get("categoryId");
  if (!categoryId || typeof categoryId !== "string") {
    throw new Error("Category is required");
  }

  const headersList = await headers();
  const cookie = headersList.get("cookie");

  const response = await fetch(
    `http://localhost:3001/api/merchants/${id}`,
    {
      method: "PUT",
      headers: {
        ...(cookie ? { cookie } : {}),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ categoryId }),
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error);
  }

  redirect(`/merchants/${id}`);
}

async function MerchantPage({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<JSX.Element> {
  const { id } = await params;

  // Fetch merchant group
  const merchantGroupRes = await fetch(
    `http://localhost:3001/api/merchants/${id}`,
    { headers: await headers() }
  );
  if (!merchantGroupRes.ok) {
    const error = await merchantGroupRes.text();
    throw new Error(JSON.stringify(error, null, 2));
  }
  const { data: merchantGroup } = await merchantGroupRes.json();

  // Fetch categories
  const categoriesRes = await fetch(
    `http://localhost:3001/api/categories`,
    { headers: await headers() }
  );
  if (!categoriesRes.ok) {
    const error = await categoriesRes.text();
    throw new Error(JSON.stringify(error, null, 2));
  }
  const { data: categories } = (await categoriesRes.json()) as {
    data: Category[];
  };

  const updateCategoryWithId = updateMerchantGroupCategory.bind(null, id);

  return (
    <div>
      <pre>{JSON.stringify(merchantGroup, null, 2)}</pre>
      <h1>Edit Merchant Group Category</h1>
      <form action={updateCategoryWithId}>
        <div>
          <label htmlFor="categoryId">Category</label>
          <select
            id="categoryId"
            name="categoryId"
            required
            defaultValue={merchantGroup.category?.id || ""}
          >
            <option value="" disabled>
              Select a category
            </option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
        <button type="submit">Update</button>
      </form>
      <Link href={`/merchants/${id}/transactions`}>Merchants</Link>
    </div>
  );
}

export default MerchantPage;
