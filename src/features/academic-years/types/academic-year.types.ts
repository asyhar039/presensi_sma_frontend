export type AcademicYearSortBy =
  | 'id'
  | 'odd_start_date'
  | 'odd_end_date'
  | 'even_start_date'
  | 'even_end_date'
  | 'is_active'
  | 'created_at'

export type AcademicYearOrder = 'asc' | 'desc'

export interface IAcademicYear {
  id: number
  odd_start_date: string
  odd_end_date: string
  even_start_date: string
  even_end_date: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface IAcademicYearParams {
  page?: number
  per_page?: number
  year?: number
  sortBy?: string
  order?: string
}

export interface IAcademicYearPayload {
  odd_start_date?: string
  odd_end_date?: string
  even_start_date?: string
  even_end_date?: string
  is_active?: boolean
}

export interface IAcademicYearPaginationMeta {
  page: number
  per_page: number
  total: number
  total_pages: number
}

export interface IAcademicYearListResult {
  items: IAcademicYear[]
  meta: IAcademicYearPaginationMeta
}
