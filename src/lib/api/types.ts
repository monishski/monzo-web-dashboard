export type ApiErrorResponse = {
  status?: number;
  success: false;
  error: string;
};

export type ApiOkResponse<T = undefined> = {
  status?: number;
  success: true;
  data?: T;
};

export type ApiResponse<T> = ApiErrorResponse | ApiOkResponse<T>;

export type PaginatedData<T> = {
  data: T[];
  pagination: {
    total: number;
    page: number;
    size: number;
  };
};
