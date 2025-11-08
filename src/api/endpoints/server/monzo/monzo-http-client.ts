import { HttpClient } from "@/lib/api/http-client";

export const monzoHttpClient = new HttpClient(process.env.MONZO_API_URL);
