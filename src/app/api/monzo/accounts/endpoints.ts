import type { MonzoAccount } from "./types";

export const fetchAccounts = async (
  accessToken: string | undefined
): Promise<{ accounts: MonzoAccount[] }> => {
  const response = await fetch(`${process.env.MONZO_API_URL}/accounts`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  // TODO: The token wont work until youve verified access on app..
  if (!response.ok) throw Error("Failed to fetch accounts");
  return response.json();
};
