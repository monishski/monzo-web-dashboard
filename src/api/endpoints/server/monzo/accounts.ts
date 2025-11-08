import { AxiosError } from "axios";

import type {
  MonzoAccount,
  MonzoError,
} from "@/lib/api/types/monzo-entities";

import { MonzoApiError } from "./monzo-api-error";
import { monzoHttpClient } from "./monzo-http-client";

export const fetchMonzoAccount = async (
  accessToken: string | undefined
): Promise<MonzoAccount | null> => {
  try {
    const { accounts } = await monzoHttpClient.get<{
      accounts: MonzoAccount[];
    }>({
      url: "/accounts",
      config: {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    });

    const retailAccount = accounts?.find(
      (account) => account.type === "uk_retail"
    );

    return retailAccount ?? null;
  } catch (err) {
    if (err instanceof AxiosError && err.response) {
      const { status, data } = err.response;
      throw new MonzoApiError({
        status,
        error: data as MonzoError,
      });
    }

    throw err;
  }
};
