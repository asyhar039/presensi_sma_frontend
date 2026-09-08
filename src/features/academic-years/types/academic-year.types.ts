export const ACADEMIC_YEAR_SEMESTERS = ['odd', 'even'] as const

export type AcademicYearSemester = (typeof ACADEMIC_YEAR_SEMESTERS)[number]

export type AcademicYearSortBy =
  | 'id'
  | 'start_date'
  | 'end_date'
  | 'semester'
  | 'is_active'
  | 'created_at'

export type AcademicYearOrder = 'asc' | 'desc'

export interface IAcademicYear {
  id: number
  start_date: string
  end_date: string
  semester: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface IAcademicYearParams {
  page?: number
  per_page?: number
  search?: string
  semester?: string
  year?: number
  sortBy?: string
  order?: string
}

export interface IAcademicYearPayload {
  start_date: string
  end_date: string
  semester: AcademicYearSemester
  is_active: boolean
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
