"use client";

import type { JSX } from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { useCreateCategory } from "@/api/queries/categories";

export default function CreateCategoryPage(): JSX.Element {
  const [name, setName] = useState("");
  const router = useRouter();
  const { mutate: createCategory, isPending: isCreating } =
    useCreateCategory({
      onSuccess: () => {
        router.push("/categories");
      },
    });

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    createCategory({ name: name.trim() });
  };

  return (
    <div>
      <h1>Create New Category</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Category Name</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="Enter category name"
            disabled={isCreating}
          />
        </div>
        <button type="submit" disabled={isCreating}>
          {isCreating ? "Creating..." : "Create"}
        </button>
      </form>
    </div>
  );
}
