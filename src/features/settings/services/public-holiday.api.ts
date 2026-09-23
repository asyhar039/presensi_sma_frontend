import type {
  ICreatePublicHolidayPayload,
  IPublicHoliday,
  IUpdatePublicHolidayPayload,
} from '@/features/settings/types/public-holiday.types'

import { api } from '@/services/api-client'

export function getPublicHolidays(month?: string) {
  return api.get<IPublicHoliday[]>('/settings/public-holidays', {
    params: month ? { state: month } : undefined,
  })
}

export function postPublicHoliday(payload: ICreatePublicHolidayPayload) {
  return api.post<IPublicHoliday>('/settings/public-holidays', payload)
}

export function putPublicHoliday(
  id: number,
  payload: IUpdatePublicHolidayPayload,
) {
  return api.put<IPublicHoliday>(`/settings/public-holidays/${id}`, payload)
}

export function deletePublicHoliday(id: number) {
  return api.delete<null>(`/settings/public-holidays/${id}`)
}
