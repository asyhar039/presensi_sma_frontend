export interface ISessionSchedule {
  id: number
  classroom: { id: number; name: string }
  teacher: { id: number; name: string }
  day: string
  start_time: string
  end_time: string
  subjects: { id: number; name: string }[]
}

export interface ISessionAnalytics {
  total_students: number
  total_present: number
  total_sick: number
  total_permit: number
  total_early_out: number
  total_late_arrival: number
}

export interface ISessionFeedItem {
  id: number
  name: string
  identity_number: string
  scanned_at: string
  inside_zone: boolean
}

export interface IPresenceCurrent {
  schedule: ISessionSchedule | null
  is_within_time: boolean
  has_session: boolean
  is_started: boolean
  is_stopped: boolean
  qr_expired: boolean
  qr_value: string | null
  qr_expires_at: string | null
  feed: ISessionFeedItem[]
  analytics: ISessionAnalytics
  channel: string | null
  session_id: number | null
}

export interface IRefreshQR {
  schedule: ISessionSchedule | null
  is_within_time: boolean
  has_session: boolean
  is_started: boolean
  is_stopped: boolean
  qr_expired: boolean
  qr_value: string | null
  qr_expires_at: string | null
}

export type SubjectLeaveStatus = 'pending' | 'approved' | 'rejected'

export interface ISubjectLeaveRow {
  student: { id: number; name: string; email: string; identity_number: string }
  class: { id: string; name: string }
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

export interface ISubjectLeaveDetail {
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
