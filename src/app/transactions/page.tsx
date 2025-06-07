import type { JSX } from "react";
import { headers } from "next/headers";

import { auth } from "@/lib/auth/auth";
import { fetchAccounts } from "@/endpoints/accounts";
import { fetchTransactions } from "@/endpoints/transactions";

async function TransactionsPage(): Promise<JSX.Element> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) throw Error("Unauthenticated");

  const { accessToken } = await auth.api.getAccessToken({
    body: { providerId: "monzo", userId: session?.user?.id },
  });

  // TODO: should redirect user to sigin page
  if (!accessToken) throw Error("Unauthenticated");

  const { accounts } = await fetchAccounts(accessToken);
  const retailAccount = accounts?.find((account) => account.type === "uk_retail");
  if (!retailAccount) throw Error("Retail account not found");

  const { id } = retailAccount;
  const transactions = await fetchTransactions(accessToken, id);

  return (
    <div>
      <pre>{JSON.stringify(transactions, null, 2)}</pre>
    </div>
  );
}

export default TransactionsPage;
