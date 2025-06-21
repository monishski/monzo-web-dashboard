import type { NextRequest, NextResponse } from "next/server";

export type Handler<Data, Context> = (
  request: NextRequest,
  context: Context
) => Promise<NextResponse<ApiResponse<Data>>>;

export type ApiErrorResponse = { success: false; error: string };

export type ApiDataResponse<T> = { success: true; data?: T };

export type ApiResponse<T> = ApiErrorResponse | ApiDataResponse<T>;

export type PaginatedData<T> = {
  data: T[];
  pagination: {
    count: number;
    total: number;
    page: number;
    size: number;
  };
};
