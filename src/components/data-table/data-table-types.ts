import type { SortingState } from '@tanstack/react-table'
import type * as v from 'valibot'

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

export type DataTableFilters = Record<string, unknown>

export type DataTableFilterSchema<
  TFilters extends DataTableFilters = DataTableFilters,
> = v.GenericSchema<unknown, TFilters>

export interface DataTableQueryState<
  TFilters extends DataTableFilters = DataTableFilters,
> {
  page: number
  perPage: number
  search: string
  sortBy?: string
  order?: DataTableSortOrder
  filters: TFilters
}

export interface DataTableStateConfig<
  TFilters extends DataTableFilters = DataTableFilters,
> {
  allowedSortBy?: readonly string[]
  defaultSortBy?: string
  defaultOrder?: DataTableSortOrder
  defaultPage?: number
  defaultPerPage?: number
  perPageOptions?: number[]
  defaultFilters: TFilters
  filterSchema?: DataTableFilterSchema<TFilters>
}

export interface DataTableSorting {
  sorting: SortingState
}
