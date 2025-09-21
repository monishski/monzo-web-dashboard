import { HttpClient } from "@/lib/http/client";
import type { Account } from "@/lib/types";

const httpClient = new HttpClient("/api");

export const fetchAccount = async (): Promise<Account> =>
  await httpClient.get<Account>({
    url: "/accounts",
  });
