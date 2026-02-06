export interface PaginationParams {
  skip: number;
  take: number;
  page: number;
  pageSize: number;
}

export interface PaginatedResult<T> {
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

export function parsePagination(query: {
  page?: string | number;
  pageSize?: string | number;
}): PaginationParams {
  const page = Math.max(1, Number(query.page) || 1);
  const pageSize = Math.min(100, Math.max(1, Number(query.pageSize) || 20));
  const skip = (page - 1) * pageSize;
  const take = pageSize;

  return { skip, take, page, pageSize };
}

export function buildPaginatedResponse<T>(
  data: T[],
  total: number,
  page: number,
  pageSize: number,
): PaginatedResult<T> {
  return {
    data,
    pagination: {
      page,
      pageSize,
      total,
      totalPages: Math.ceil(total / pageSize),
    },
  };
}
