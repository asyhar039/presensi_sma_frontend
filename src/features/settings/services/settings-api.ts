import type {
  IDaySchedule,
  IPublicHoliday,
  ISchoolZone,
  IUpdateDaySchedulePayload,
} from '@/features/settings/types/settings.types'

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

export function getPublicHolidays() {
  return api.get<IPublicHoliday[]>('/settings/public-holidays')
}

export function putPublicHolidays(payload: IPublicHoliday[]) {
  return api.put<IPublicHoliday[]>('/settings/public-holidays', payload)
}

export function deletePublicHoliday(date: string) {
  return api.delete<null>(
    `/settings/public-holidays/${encodeURIComponent(date)}`,
  )
}

export function getSchoolZones() {
  return api.get<ISchoolZone[]>('/settings/school-zones')
}

export function putSchoolZones(payload: ISchoolZone[]) {
  return api.put<ISchoolZone[]>('/settings/school-zones', payload)
}

export function deleteSchoolZone(name: string) {
  return api.delete<null>(`/settings/school-zones/${encodeURIComponent(name)}`)
}
