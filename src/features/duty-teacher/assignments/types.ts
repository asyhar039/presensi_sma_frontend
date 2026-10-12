export interface IDutyAssignmentTeacher {
  id: number
  name: string
  email: string
}
export interface IDutyAssignmentAcademicYear {
  id: number
  odd_start_date: string
  odd_end_date: string
  even_start_date: string
  even_end_date: string
  is_active: boolean
  created_at: string
  updated_at: string
}
export interface IDutyAssignment {
  id: number
  teacher: IDutyAssignmentTeacher
  academic_year: IDutyAssignmentAcademicYear
  day: string
  start_time: string
  end_time: string
  created_at: string
  updated_at: string
}
export interface IDutyAssignmentParams {
  page?: number
  per_page?: number
  search?: string
  sortBy?: string
  order?: string
  academic_year_id?: number | string
  teacher_id?: number | string
  day?: string
}
export interface IDutyAssignmentPayload {
  academic_year_id: number
  teacher_id: number
  day: string
  start_time: string
  end_time: string
}
export interface IDutyAssignmentMeta {
  page: number
  per_page: number
  total: number
  total_pages: number
}
export interface IDutyAssignmentListResult {
  items: IDutyAssignment[]
  meta: IDutyAssignmentMeta
}
