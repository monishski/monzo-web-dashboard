import type { JSX } from "react";
import { headers } from "next/headers";

async function MerchantsPage(): Promise<JSX.Element> {
  const response = await fetch("http://localhost:3001/api/merchants", {
    headers: await headers(),
  });
  if (!response.ok) {
    const error = await response.json();
    throw Error(JSON.stringify({ error }, null, 2));
  }

  const { data: merchants } = await response.json();

  return (
    <div>
      <pre>{JSON.stringify(merchants, null, 2)}</pre>
    </div>
  );
}

export default MerchantsPage;
