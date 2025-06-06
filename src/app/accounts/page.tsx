import { fetchAccounts } from "@/endpoints/accounts";
import { auth } from "@/lib/auth/auth";

import { headers } from "next/headers";

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
