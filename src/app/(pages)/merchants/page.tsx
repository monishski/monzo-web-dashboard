import type { JSX } from "react";
import { headers } from "next/headers";
import Link from "next/link";

import type { MerchantGroup } from "@/lib/types";

async function MerchantsPage(): Promise<JSX.Element> {
  const response = await fetch("http://localhost:3001/api/merchants", {
    headers: await headers(),
  });
  if (!response.ok) {
    const error = await response.json();
    throw Error(JSON.stringify({ error }, null, 2));
  }

  const { data: merchantGroups } = (await response.json()) as {
    data: MerchantGroup[];
  };

  return (
    <div>
      <div>
        {merchantGroups.length > 0 &&
          merchantGroups.map((merchantGroup) => (
            <div key={merchantGroup.id}>
              <Link
                href={`/merchants/${merchantGroup.id}`}
                className="text-blue-500"
              >
                {merchantGroup.name}
              </Link>
              <pre>{JSON.stringify(merchantGroup, null, 2)}</pre>
            </div>
          ))}
      </div>
    </div>
  );
}

export default MerchantsPage;
