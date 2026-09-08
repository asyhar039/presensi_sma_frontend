export type DataTableSortOrder = 'asc' | 'desc'

export interface DataTablePaginationState {
  page: number
  perPage: number
  total: number
  totalPages: number
}

export interface DataTableFilterOption {
  label: string
  value: string
}

export interface DataTableFilter {
  key: string
  label: string
  value: string
  placeholder?: string
  options: DataTableFilterOption[]
  onChange: (value: string) => void
}
