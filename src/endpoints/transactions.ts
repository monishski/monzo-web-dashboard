import { MonzoTransaction } from "@/types/monzo/transaction";

export const fetchTransactions = async (
  accessToken: string | undefined,
  accountId: string | undefined,
  limit: number = 100,
  before?: string
): Promise<MonzoTransaction[]> => {
  const url = new URL(`${process.env.MONZO_API_URL}/transactions`);
  url.searchParams.append("expand[]", "merchant");
  url.searchParams.append("account_id", accountId ?? "");
  url.searchParams.append("limit", limit.toString());
  if (before) {
    url.searchParams.append("before", before);
  }

  const response = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) throw Error("Failed to fetch transactions");
  return response.json();
};
