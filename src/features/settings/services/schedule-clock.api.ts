import type {
  IDaySchedule,
  IUpdateDaySchedulePayload,
} from '@/features/settings/types/schedule-clock.types'

import { api } from '@/services/api-client'

export function getDaySchedules() {
  return api.get<IDaySchedule[]>('/settings/schedules')
}

export function getDaySchedule(day: string) {
  return api.get<IDaySchedule>(`/settings/schedules/${day}`)
}

export function putDaySchedule(payload: IUpdateDaySchedulePayload) {
  return api.put<IDaySchedule>('/settings/schedules', payload)
}
