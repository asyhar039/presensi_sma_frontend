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

export type DropdownOption = {
  label: string
  value: string
}

export type DropdownParams = {
  search?: string
  page: number
  page_size: number
}

export type DropdownQueryFn<TData extends DropdownOption = DropdownOption> = (
  params: Partial<DropdownParams>,
) => Promise<ApiPaginateResponse<TData>>

export type DropdownSelectedParams = {
  active_ids: string[]
}

export type DropdownSelectedQueryFn<
  TData extends DropdownOption = DropdownOption,
> = (params: DropdownSelectedParams) => Promise<TData[]>
