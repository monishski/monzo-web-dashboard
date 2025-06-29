export type ApiErrorResponse = {
  status?: number;
  success: false;
  error: string;
};

export type ApiSuccessResponse<T> = {
  status?: number;
  success: true;
  data?: T;
};

export type ApiResponse<T> = ApiErrorResponse | ApiSuccessResponse<T>;

export type PaginatedData<T> = {
  data: T[];
  pagination: {
    count: number;
    total: number;
    page: number;
    size: number;
  };
};
