import { auth } from "@/lib/auth/auth";

import { headers } from "next/headers";

console.log(process.env.MONZO_API_URL);

const fetchAccounts = async (accessToken: string | undefined) => {
  const response = await fetch(`${process.env.MONZO_API_URL}/accounts`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  // TODO: The token wont work until youve verified access on app..
  if (!response.ok) throw Error("Failed to fetch accounts");
  return response.json();
};

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
