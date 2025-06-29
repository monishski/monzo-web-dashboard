import type { ApiErrorResponse, ApiOkResponse } from "./types";

export class MiddlewareResponse {
  static ok<T>({
    data,
    status = 200,
  }: {
    data?: T;
    status?: number;
  }): ApiOkResponse<T> {
    return { status, success: true, data };
  }

  static success<T>(data: T): ApiOkResponse<T> {
    return this.ok({ data, status: 200 });
  }

  static created<T>(data?: T): ApiOkResponse<T> {
    return this.ok({ data, status: 201 });
  }

  static noContent(): ApiOkResponse {
    return this.ok({ status: 204 });
  }

  static error({
    error,
    status = 400,
  }: {
    error: string;
    status?: number;
  }): ApiErrorResponse {
    return { status, success: false, error };
  }

  static badRequest(error = "Bad request"): ApiErrorResponse {
    return this.error({ error, status: 400 });
  }

  static unauthorized(error = "Unauthorized"): ApiErrorResponse {
    return this.error({ error, status: 401 });
  }

  static forbidden(error = "Forbidden"): ApiErrorResponse {
    return this.error({ error, status: 403 });
  }

  static notFound(error = "Not found"): ApiErrorResponse {
    return this.error({ error, status: 404 });
  }

  static conflict(error = "Conflict"): ApiErrorResponse {
    return this.error({ error, status: 409 });
  }

  static internalServerError(
    error = "An unexpected error occurred"
  ): ApiErrorResponse {
    return this.error({ error, status: 500 });
  }
}
