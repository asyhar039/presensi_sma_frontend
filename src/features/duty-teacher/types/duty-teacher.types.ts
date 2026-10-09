export interface IDutyStatusSlot {
  day: string
  start_time: string
  end_time: string
}

export interface IDutyStatus {
  has_duty_teacher: boolean
  is_active: boolean | string
  duty_teacher: IDutyStatusSlot | null
}

export type DutyLeaveStatus = 'pending' | 'approved' | 'rejected'
export type DutyDecision = 'approved' | 'rejected'

export interface IDutyLeaveRow {
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
    type: { key: string; label: string }
    status: { key: string; label: string }
    key: string
    current_step: string
    range_date: (string | null)[]
    date: string
  }
}

export interface IDutyLeaveDetail {
  id: number
  key: string
  type: { key: string; label: string }
  status: { key: string; label: string }
  start_date: string
  end_date: string
  range_date: (string | null)[]
  date: string
  time_out: string | null
  time_in: string | null
  exit_reason: string | null
  destination: string | null
  contact_person: string | null
  estimated_arrival_time: string | null
  late_reason: string | null
  notes: string | null
  attachment: string | null
  current_step: string
  approvals: {
    step: string
    decision: string
    decided_at: string | null
    notes: string | null
  }[]
  requested_at: string
}

export interface IDutyLeaveParams {
  page?: number
  per_page?: number
  search?: string
  status?: string
  sortBy?: string
  order?: string
}

export interface IDecideLeavePayload {
  decision: DutyDecision
  notes?: string
}
