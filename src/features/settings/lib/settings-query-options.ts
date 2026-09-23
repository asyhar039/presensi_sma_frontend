import { queryOptions } from '@tanstack/react-query'

import {
  getDaySchedules,
  getPublicHolidays,
  getSchoolZones,
} from '@/features/settings/services/settings-api'

export const settingsKeys = {
  all: ['settings'] as const,
  schedules: () => [...settingsKeys.all, 'schedules'] as const,
  holidays: () => [...settingsKeys.all, 'public-holidays'] as const,
  zones: () => [...settingsKeys.all, 'school-zones'] as const,
}

export function daySchedulesQueryOptions() {
  return queryOptions({
    queryKey: settingsKeys.schedules(),
    queryFn: getDaySchedules,
    staleTime: 30_000,
  })
}

export function publicHolidaysQueryOptions() {
  return queryOptions({
    queryKey: settingsKeys.holidays(),
    queryFn: getPublicHolidays,
    staleTime: 30_000,
  })
}

export function schoolZonesQueryOptions() {
  return queryOptions({
    queryKey: settingsKeys.zones(),
    queryFn: getSchoolZones,
    staleTime: 30_000,
  })
}
