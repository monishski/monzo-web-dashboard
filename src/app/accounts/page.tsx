import { headers } from "next/headers";

import { auth } from "@/lib/auth/auth";
import { fetchAccounts } from "@/endpoints/accounts";

async function AccountsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const { accessToken } = await auth.api.getAccessToken({
    body: {
      providerId: "monzo",
      userId: session?.user?.id,
    },
  });

  const accounts = await fetchAccounts(accessToken);

  return (
    <div>
      <pre>{JSON.stringify(accounts, null, 2)}</pre>
    </div>
  );
}
export default AccountsPage;
