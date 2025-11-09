import type { AxiosRequestConfig } from "axios";

import { HttpClient } from "@/lib/api/http-client";
import type { ApiResponse } from "@/lib/api/types";

export class ApiHttpClient extends HttpClient {
  constructor() {
    super("/api");
  }

  private apiResponseHandler<T>(res: ApiResponse<T>): T {
    if (!res.success) throw new Error(res.error);
    return res.data;
  }

  async get<Response>({
    url,
    config,
  }: {
    url: string;
    config?: AxiosRequestConfig;
  }): Promise<Response> {
    const res = await super.get<ApiResponse<Response>>({
      url,
      config,
    });
    return this.apiResponseHandler(res);
  }

  async post<Payload, Response = undefined>({
    url,
    payload,
    config,
  }: {
    url: string;
    payload: Payload;
    config?: AxiosRequestConfig;
  }): Promise<Response> {
    const res = await super.post<Payload, ApiResponse<Response>>({
      url,
      payload,
      config,
    });
    return this.apiResponseHandler(res);
  }

  async put<Payload, Response = undefined>({
    url,
    payload,
    config,
  }: {
    url: string;
    payload: Payload;
    config?: AxiosRequestConfig;
  }): Promise<Response> {
    const res = await super.put<Payload, ApiResponse<Response>>({
      url,
      payload,
      config,
    });
    return this.apiResponseHandler(res);
  }

  async delete<Response = undefined>({
    url,
    config,
  }: {
    url: string;
    config?: AxiosRequestConfig;
  }): Promise<Response> {
    const res = await super.delete<ApiResponse<Response>>({ url, config });
    return this.apiResponseHandler(res);
  }
}

export const apiHttpClient = new ApiHttpClient();
