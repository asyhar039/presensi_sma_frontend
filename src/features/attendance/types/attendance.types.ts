export const ATTENDANCE_STATUSES = [
  'present',
  'permission',
  'sick',
  'absent',
] as const

export type AttendanceStatus = (typeof ATTENDANCE_STATUSES)[number]

export const ATTENDANCE_STATUS_LABELS: Record<AttendanceStatus, string> = {
  present: 'Hadir',
  permission: 'Izin',
  sick: 'Sakit',
  absent: 'Alpa',
}

export const ATTENDANCE_STATUS_BADGE_VARIANTS: Record<
  AttendanceStatus,
  'default' | 'secondary' | 'outline' | 'destructive'
> = {
  present: 'default',
  permission: 'secondary',
  sick: 'outline',
  absent: 'destructive',
}

export interface IAttendanceStudent {
  id: number
  user: {
    id: number
    identity_number: string
    name: string
    email: string
  }
  gender: {
    key: string
    label: string
  }
}

export interface IAttendanceRecord {
  id: number
  student_id: number
  student: IAttendanceStudent
  subject_id: number
  subject_name: string
  classroom_id: number
  classroom_name: string
  date: string
  time_start: string
  time_end: string
  room_name: string | null
  status: AttendanceStatus
  description: string | null
  created_at: string
  updated_at: string
}

export interface IAttendanceParams {
  page?: number
  per_page?: number
  search?: string
  classroom_id?: number | string
  month?: number | string
  semester?: string
  status?: string
  sortBy?: string
  order?: string
}

export interface IAttendancePaginationMeta {
  page: number
  per_page: number
  total: number
  total_pages: number
}

export interface IAttendanceListResult {
  items: IAttendanceRecord[]
  meta: IAttendancePaginationMeta
}

export interface IAttendanceSummary {
  total_students: number
  average_attendance: number
  total_present: number
  total_permission: number
  total_sick: number
  total_absent: number
}

export interface IStudentAttendanceSummary {
  student_id: number
  student_name: string
  student_nis: string
  present: number
  permission: number
  sick: number
  absent: number
  total: number
  attendance_rate: number
}

export interface IStudentAttendanceDetail {
  student: IAttendanceStudent
  summary: IStudentAttendanceSummary
  records: IAttendanceRecord[]
}

export type AttendanceSortBy = 'date' | 'student_name' | 'subject' | 'status'

export type AttendanceOrder = 'asc' | 'desc'

export interface IClassOption {
  id: number
  name: string
  academic_year: {
    id: number
    start_date: string
    end_date: string
    semester: string
  } | null
}

export interface IMonthOption {
  value: number
  label: string
}

export interface ISemesterOption {
  value: string
  label: string
}
