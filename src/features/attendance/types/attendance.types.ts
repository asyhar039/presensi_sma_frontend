export const ATTENDANCE_STATUSES = [
  'present',
  'absent',
  'late',
  'permission',
] as const

export type AttendanceStatus = (typeof ATTENDANCE_STATUSES)[number]

export const ATTENDANCE_SESSIONS_STATUSES = [
  'active',
  'closed',
  'scheduled',
] as const

export type AttendanceSessionStatus =
  (typeof ATTENDANCE_SESSIONS_STATUSES)[number]

export type AttendanceSortBy = 'id' | 'session_date' | 'status' | 'created_at'

export type AttendanceOrder = 'asc' | 'desc'

export interface IAttendanceUser {
  id: number
  identity_number: string
  name: string
  email: string
  phone_number: string | null
}

export interface IAttendanceLabel {
  key: string
  label: string
}

export interface IAttendanceSession {
  id: number
  subject: string
  class_name: string
  room: string
  start_time: string
  end_time: string
  qr_code: string | null
  status: AttendanceSessionStatus
  teacher_id: number
  created_at: string
  updated_at: string
}

export interface IAttendanceParams {
  page?: number
  per_page?: number
  search?: string
  status?: string
  sortBy?: string
  order?: string
  teacher_id?: number
}

export interface IAttendanceSessionPayload {
  subject: string
  class_name: string
  room: string
  start_time: string
  end_time: string
}

export interface IAttendanceSessionDetail extends IAttendanceSession {}

export interface IAttendancePaginationMeta {
  page: number
  per_page: number
  total: number
  total_pages: number
}

export interface IAttendanceListResult {
  items: IAttendanceSession[]
  meta: IAttendancePaginationMeta
}

export interface IAttendanceLog {
  id: number
  student: IAttendanceUser
  class_name: string
  status: AttendanceStatus
  session_date: string
  scanned_at: string | null
  note: string | null
  created_at: string
}

export interface IAttendanceLogParams {
  page?: number
  per_page?: number
  search?: string
  status?: string
  sortBy?: string
  order?: string
  teacher_id?: number
}

export interface IAttendanceLogListResult {
  items: IAttendanceLog[]
  meta: IAttendancePaginationMeta
}

export interface IAttendanceRequest {
  id: number
  student: IAttendanceUser
  class_name: string
  session_id: number
  session_subject: string
  start_time: string
  end_time: string
  reason: string
  purpose: string
  pick_up_person: string | null
  supervising_teacher: string | null
  attachment: string | null
  status: 'waiting' | 'approved' | 'rejected'
  reviewed_by: string | null
  reviewed_at: string | null
  created_at: string
  updated_at: string
}

export interface IAttendanceRequestParams {
  page?: number
  per_page?: number
  search?: string
  status?: string
  sortBy?: string
  order?: string
}

export interface IAttendanceRequestPayload {
  student_id: number
  session_id: number
  reason: string
  purpose: string
  pick_up_person?: string | null
  supervising_teacher?: string | null
  attachment?: string | null
}

export interface IAttendanceRequestListResult {
  items: IAttendanceRequest[]
  meta: IAttendancePaginationMeta
}

export interface IAttendanceSummary {
  total_students: number
  present_count: number
  absent_count: number
  late_count: number
  permission_count: number
  percentage: number
  total_present?: number
  total_absent?: number
  total_late?: number
  total_permission?: number
  total_records?: number
}

export interface IAttendanceSummaryParams {
  session_id?: number
}
