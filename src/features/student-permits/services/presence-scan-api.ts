import { api } from '@/services/api-client'

export interface IScanPresencePayload {
  key: string
  latitude?: number
  longitude?: number
}

export interface IScanPresenceResult {
  record_id: string
  scanned_at: string
  inside_zone: boolean
  session_id: number
}

export function scanPresence(payload: IScanPresencePayload) {
  return api.post<IScanPresenceResult>('/student/presence/scan', payload)
}

export interface ICalendarSchedule {
  schedule_id: string
  day: string
  start_time: string
  end_time: string
  teacher: string
  status: string
  permit_types: string[]
}

export interface ICalendarDay {
  date: string
  day: string
  is_holiday: string
  schedules: ICalendarSchedule[]
}

export interface IMonthlyCalendar {
  month: string
  days: ICalendarDay[]
}

export function getMonthlyCalendar(month: string) {
  return api.get<IMonthlyCalendar>('/student/presence/history', {
    params: { month },
  })
}
