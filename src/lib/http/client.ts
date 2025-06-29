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

  async post<Data = undefined, Response = undefined>({
    url,
    data,
    config,
  }: {
    url: string;
    data: Data;
    config?: AxiosRequestConfig;
  }): Promise<Response> {
    const res = await this.instance.post<
      Response,
      AxiosResponse<Response, Data>,
      Data
    >(url, data, config);
    return res.data;
  }

  async put<Data = undefined, Response = undefined>({
    url,
    data,
    config,
  }: {
    url: string;
    data: Data;
    config?: AxiosRequestConfig;
  }): Promise<Response> {
    const res = await this.instance.put<
      Response,
      AxiosResponse<Response, Data>,
      Data
    >(url, data, config);
    return res.data;
  }

  async delete<Response>({
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
