export type PermitType = 'sick' | 'leave_school' | 'leave_in'

export type PermitStatus = 'pending' | 'approved' | 'rejected'

export interface IStudentPermit {
  id: number
  student_id: number
  type: PermitType
  start_date: string
  end_date: string
  reason: string
  document_url?: string | null
  status: PermitStatus
  created_at: string
  updated_at: string
}

export interface IStudentProfile {
  id: number
  identity_number: string
  name: string
  email: string
  classroom_id: number
  classroom_name: string
  homeroom_teacher: string
}
