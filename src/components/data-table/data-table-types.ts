import type { SortingState } from '@tanstack/react-table'

export type DataTableSortOrder = 'asc' | 'desc'

export interface DataTablePaginationMeta {
  page: number
  per_page: number
  total: number
  total_pages: number
}

export interface DataTableListResult<TData> {
  items: TData[]
  meta: DataTablePaginationMeta
}

export type DataTableApiParams = Record<string, string | number | undefined>

export type DataTableQueryFn<TData> = (
  params: DataTableApiParams,
) => Promise<DataTableListResult<TData>>

export interface DataTableFilterOption {
  label: string
  value: string
}

export interface DataTableFilterDef {
  key: string
  label: string
  placeholder?: string
  options?: DataTableFilterOption[]
  allowedValues?: readonly string[]
  defaultValue?: string
  validate?: (value: string) => boolean
}

export type DataTableFilterValues = Record<string, string>

export interface DataTableQueryState {
  page: number
  perPage: number
  search: string
  sortBy?: string
  order?: DataTableSortOrder
  filters: DataTableFilterValues
}

export interface DataTableStateConfig {
  allowedSortBy?: readonly string[]
  defaultSortBy?: string
  defaultOrder?: DataTableSortOrder
  defaultPage?: number
  defaultPerPage?: number
  perPageOptions?: number[]
  filterDefs?: DataTableFilterDef[]
}

export interface DataTableSorting {
  sorting: SortingState
}
