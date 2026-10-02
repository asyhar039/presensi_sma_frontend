export interface IStudentAttendanceScan {
  id: number
  student_id: number
  session_id: string
  scanned_at: string
  status: 'present' | 'permission' | 'sick' | 'absent'
  subject_name: string
  classroom_name: string
}

export interface IAttendanceScanResult {
  success: boolean
  message: string
  data?: IStudentAttendanceScan
}
