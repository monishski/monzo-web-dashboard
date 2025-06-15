import type { JSX } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

async function createCategory(formData: FormData): Promise<void> {
  "use server";

  const name = formData.get("name");
  if (!name || typeof name !== "string") {
    alert("Name is required");
    return;
  }

  const headersList = await headers();
  const cookie = headersList.get("cookie");

  const response = await fetch("http://localhost:3001/api/categories", {
    method: "POST",
    headers: {
      ...(cookie ? { cookie } : {}),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name }),
  });

  if (!response.ok) {
    const error = await response.text();
    alert(error);
    return;
  }

  redirect("/categories");
}

export default function CreateCategoryPage(): JSX.Element {
  return (
    <div>
      <h1>Create New Category</h1>
      <form action={createCategory}>
        <div>
          <label htmlFor="name">Category Name</label>
          <input
            type="text"
            id="name"
            name="name"
            required
            placeholder="Enter category name"
          />
        </div>
        <button type="submit">Create</button>
      </form>
    </div>
  );
}
