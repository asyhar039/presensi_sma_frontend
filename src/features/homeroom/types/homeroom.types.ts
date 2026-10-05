export interface IHomeroomClass {
  id: number
  name: string
}

export interface IHomeroomInfo {
  has_homeroom: boolean
  class: IHomeroomClass | null
}

export type HomeroomLeaveTypeKey = 'sick_leave' | 'early_out' | 'late_arrival'
export type HomeroomLeaveStatusKey = 'pending' | 'approved' | 'rejected'

export interface IKeyLabel {
  key: string
  label: string
}

export interface IHomeroomLeaveItem {
  student: {
    id: number
    name: string
    email: string
    identity_number: string
  }
  class: {
    id: string
    name: string
  }
  leave_request: {
    id: number
    type: IKeyLabel
    status: IKeyLabel
    key: string
    current_step: string
    range_date: (string | null)[]
    date: string
  }
}

export interface IHomeroomLeaveApproval {
  step: string
  decision: string
  decided_at: string
  notes: string
}

export interface IHomeroomLeaveDetail {
  id: number
  key: string
  type: IKeyLabel
  status: IKeyLabel
  start_date: string
  end_date: string
  range_date: (string | null)[]
  date: string
  time_out: string
  time_in: string
  exit_reason: string
  destination: string
  contact_person: string
  estimated_arrival_time: string
  late_reason: string
  notes: string
  attachment: string
  current_step: string
  approvals: IHomeroomLeaveApproval[]
  requested_at: string
}

export interface IHomeroomLeaveParams {
  page?: number
  per_page?: number
  search?: string
  sortBy?: string
  order?: string
  status?: string
  type?: string
}

export interface IHomeroomLeaveListResult {
  items: IHomeroomLeaveItem[]
  meta: {
    page: number
    per_page: number
    total: number
    total_pages: number
  }
}

export interface IHomeroomDecisionPayload {
  decision: 'approved' | 'rejected'
  notes?: string
}
