export interface IQRCode {
  id: string
  code: string
  created_at: string
  expires_at: string
}

export type AttendanceLogStatus = 'present' | 'permission' | 'sick' | 'absent'

export interface IAttendanceLog {
  id: number
  student_id: number
  student_name: string
  student_nis: string
  status: AttendanceLogStatus
  timestamp: string
  subject_name: string
}

export interface IAttendanceSession {
  id: string
  teacher_id: number
  classroom_id: number
  subject_id: number
  qr_code: IQRCode
  status: 'active' | 'closed'
  started_at: string
  ended_at?: string
  total_present: number
  total_permission: number
  total_sick: number
  total_absent: number
}

export interface ITeacherPermitRecord {
  id: number
  student_id: number
  student_name: string
  student_nis: string
  classroom_id: number
  classroom_name: string
  type: 'sick' | 'leave_school' | 'leave_in'
  date: string
  duration: string
  reason: string
  document_url?: string | null
  status: 'pending' | 'approved' | 'rejected'
  created_at: string
}

export interface IAttendanceStats {
  present: number
  permission: number
  sick: number
  absent: number
}
