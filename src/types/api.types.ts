export type ApiResponse<T> = {
  data: T
  message: string
}

export type PaginationResponse = {
  page: number
  limit: number
  total: number
  total_pages: number
}

export type ApiPaginateResponse<T> = ApiResponse<T[]> & {
  meta: PaginationResponse
}
