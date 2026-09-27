export type StudentAttendanceStatus =
  | 'present'
  | 'sick'
  | 'leave_school'
  | 'leave_in'
  | 'absent'

export interface IStudentAttendanceRecord {
  id: number
  date: string
  check_in_time: string | null
  check_out_time: string | null
  status: StudentAttendanceStatus
  status_label: string
  remarks: string | null
  document_url: string | null
}

export interface IStudentAttendanceSummary {
  total_present: number
  total_sick: number
  total_leave_school: number
  total_leave_in: number
  total_absent: number
  attendance_rate: number
}

export interface IStudentAttendanceHistoryParams {
  page?: number
  per_page?: number
  status?: string
  month?: string
}
