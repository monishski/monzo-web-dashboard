"use client";

import type { JSX } from "react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  useDeleteCategory,
  useGetCategory,
  useUpdateCategory,
} from "@/api/queries/categories";
import {
  getCategoriesUrl,
  getMerchantsUrl,
  getTransactionsUrl,
} from "@/routing";

function CategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}): JSX.Element {
  const [id, setId] = useState<string>("");
  const [name, setName] = useState("");
  const router = useRouter();

  const { data: category, isLoading, error } = useGetCategory(id);
  const { mutate: updateCategory, isPending: isUpdating } =
    useUpdateCategory({
      onSuccess: () => {
        router.push(getCategoriesUrl());
      },
    });
  const { mutate: deleteCategory, isPending: isDeleting } =
    useDeleteCategory({
      onSuccess: () => {
        router.push(getCategoriesUrl());
      },
    });

  useEffect(() => {
    params.then(({ id }) => setId(id));
  }, [params]);

  useEffect(() => {
    if (category) setName(category.name);
  }, [category]);

  const handleUpdate = (e: React.FormEvent): void => {
    e.preventDefault();
    updateCategory({ id, name: name.trim() });
  };

  const handleDelete = (): void => {
    deleteCategory(id);
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!category) return <div>Category not found</div>;

  return (
    <div>
      <pre>{JSON.stringify(category, null, 2)}</pre>
      <button onClick={handleDelete} disabled={isDeleting}>
        {isDeleting ? "Deleting..." : "Delete"}
      </button>
      <h1>Edit</h1>
      <form onSubmit={handleUpdate}>
        <div>
          <label htmlFor="name">Category Name</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="Enter category name"
          />
        </div>
        <button type="submit" disabled={isUpdating}>
          {isUpdating ? "Updating..." : "Update"}
        </button>
      </form>
      <Link href={getTransactionsUrl({ categoryIds: [id] })}>
        Transactions
      </Link>
      <Link href={getMerchantsUrl({ categoryIds: [id] })}>Merchants</Link>
    </div>
  );
}

export default CategoryPage;
