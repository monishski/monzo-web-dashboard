import type {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from "axios";
import axios from "axios";

export class HttpClient {
  private instance: AxiosInstance;

  constructor(baseURL?: string) {
    this.instance = axios.create({
      baseURL,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  async get<Response>({
    url,
    config,
  }: {
    url: string;
    config?: AxiosRequestConfig;
  }): Promise<Response> {
    const res = await this.instance.get<Response>(url, config);
    return res.data;
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
    const res = await this.instance.post<
      Response,
      AxiosResponse<Response, Payload>,
      Payload
    >(url, payload, config);
    return res.data;
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
    const res = await this.instance.put<
      Response,
      AxiosResponse<Response, Payload>,
      Payload
    >(url, payload, config);
    return res.data;
  }

  async delete<Response = undefined>({
    url,
    config,
  }: {
    url: string;
    config?: AxiosRequestConfig;
  }): Promise<Response> {
    const res = await this.instance.delete<Response>(url, config);
    return res.data;
  }
}
