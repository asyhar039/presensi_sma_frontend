export type PermitType = 'sick' | 'leave_school' | 'leave_in'
export type PermitStatus = 'pending' | 'approved' | 'rejected'

export interface IPermitStudent {
  id: number
  user: {
    id: number
    identity_number: string
    name: string
    email: string
  }
}

export interface IPermitRecord {
  id: number
  student_id: number
  student: IPermitStudent
  classroom_id: number
  classroom_name: string
  type: PermitType
  date: string
  duration?: string
  reason: string
  document_url?: string | null
  status: PermitStatus
  created_at: string
  updated_at: string
}

export interface IPermitStatistics {
  total_today: number
  pending_validation: number
  sick_this_month: number
  leave_school_this_month: number
  leave_in_this_month: number
}

export interface IPermitParams {
  page?: number
  per_page?: number
  search?: string
  classroom_id?: number | string
  type?: string
  status?: string
  date?: string
  sortBy?: string
  order?: string
}

export interface IPermitListResult {
  items: IPermitRecord[]
  meta: {
    page: number
    per_page: number
    total: number
    total_pages: number
  }
}
