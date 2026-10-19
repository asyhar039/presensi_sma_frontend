export interface IAttendanceReportSummary {
  effective_days: number
  average_attendance: number
  chronic_absent_count: number
  best_classroom?: {
    id: number | string
    name: string
    attendance_rate: number
  } | null
  best_classroom_name?: string
  best_classroom_rate?: number
}

export type MatrixStatus = 'H' | 'I' | 'S' | 'A' | string

export interface IAttendanceMatrixItem {
  id?: number
  student_id?: number
  nis?: string
  student_nis?: string
  name?: string
  student_name?: string
  className?: string
  classroom_name?: string
  matrix: MatrixStatus[]
  h?: number
  i?: number
  s?: number
  a?: number
  present?: number
  permission?: number
  sick?: number
  absent?: number
  rate?: number
  attendance_rate?: number
  total?: number
}

export interface IAttendanceReportFilterParams {
  month: string | number
  year: string | number
  classroom_id?: string | number
  subject_id?: string | number
  status?: string
  date_range?: string
  format?: 'compact' | string
  page?: number
  per_page?: number
}

export interface IAttendanceMatrixPaginationMeta {
  page: number
  per_page: number
  total: number
  total_pages: number
}

export interface IAttendanceMatrixResult {
  items: IAttendanceMatrixItem[]
  meta?: IAttendanceMatrixPaginationMeta
}
