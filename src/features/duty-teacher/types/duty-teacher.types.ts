export interface ILeaveRequest {
  id: number
  student_id: number
  student_name: string
  student_nis: string
  classroom_id: number
  classroom_name: string
  leave_type: 'school' | 'temporary'
  reason: string
  leave_date: string
  estimated_return: string
  status: 'pending' | 'approved' | 'away' | 'returned'
  scanned_out_at?: string
  scanned_in_at?: string
  created_at: string
}

export interface IDutyTeacherStats {
  total_today: number
  pending_validation: number
  approved: number
  currently_away: number
}

export interface IDutyTeacherParams {
  page?: number
  per_page?: number
  date?: string
  classroom_id?: number | string
  status?: string
  search?: string
}

export interface IDutyTeacherListResult {
  items: ILeaveRequest[]
  meta: {
    page: number
    per_page: number
    total: number
    total_pages: number
  }
}
