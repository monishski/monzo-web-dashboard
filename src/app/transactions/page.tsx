import { headers } from "next/headers";

import { auth } from "@/lib/auth/auth";
import { fetchAccounts } from "@/endpoints/accounts";
import { fetchTransactions } from "@/endpoints/transactions";

async function TransactionsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const { accessToken } = await auth.api.getAccessToken({
    body: {
      providerId: "monzo",
      userId: session?.user?.id,
    },
  });

  const { accounts } = await fetchAccounts(accessToken);

  const retailAccount = accounts?.find((account) => account.type === "uk_retail");

  const transactions = await fetchTransactions(accessToken, retailAccount?.id);

  return (
    <div>
      <pre>{JSON.stringify(transactions, null, 2)}</pre>
    </div>
  );
}

export default TransactionsPage;
