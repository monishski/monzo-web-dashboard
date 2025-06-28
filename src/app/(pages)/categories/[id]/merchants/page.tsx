import type { JSX } from "react";
import { headers } from "next/headers";

async function CategoryMerchantsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<JSX.Element> {
  const { id } = await params;

  const headersList = await headers();
  const cookie = headersList.get("cookie");

  const response = await fetch(
    `http://localhost:3001/api/categories/${id}/merchants`,
    {
      headers: {
        ...(cookie ? { cookie } : {}),
        "Content-Type": "application/json",
      },
    }
  );
  if (!response.ok) {
    const error = await response.text();
    throw new Error(JSON.stringify(error, null, 2));
  }
  const { data: merchants } = await response.json();

  return (
    <div>
      <pre>{JSON.stringify(merchants, null, 2)}</pre>
    </div>
  );
}

export default CategoryMerchantsPage;
