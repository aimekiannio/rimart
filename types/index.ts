export type UserRole = "customer" | "seller" | "admin";

export type ApiResponse<T> = {
  data: T;
  message?: string;
  success: boolean;
};

export type PaginatedResponse<T> = ApiResponse<T> & {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
};

export type PageProps = {
  params: Promise<Record<string, string>>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};
