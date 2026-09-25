import type { SchoolZoneStatusFilter } from '@/features/settings/types/school-zone.types'

import { keepPreviousData, queryOptions } from '@tanstack/react-query'

import { getPublicHolidays } from '@/features/settings/services/public-holiday.api'
import { getDaySchedules } from '@/features/settings/services/schedule-clock.api'
import { getSchoolZones } from '@/features/settings/services/school-zone.api'

export const settingsKeys = {
  all: ['settings'] as const,
  schedules: () => [...settingsKeys.all, 'schedules'] as const,
  holidays: (month?: string) =>
    month
      ? ([...settingsKeys.all, 'public-holidays', month] as const)
      : ([...settingsKeys.all, 'public-holidays'] as const),
  zones: (filter?: SchoolZoneStatusFilter) =>
    filter
      ? ([...settingsKeys.all, 'school-zones', filter] as const)
      : ([...settingsKeys.all, 'school-zones'] as const),
}

export function daySchedulesQueryOptions() {
  return queryOptions({
    queryKey: settingsKeys.schedules(),
    queryFn: getDaySchedules,
    staleTime: 30_000,
  })
}

export function publicHolidaysQueryOptions(month?: string) {
  return queryOptions({
    queryKey: settingsKeys.holidays(month),
    queryFn: () => getPublicHolidays(month),
    staleTime: 30_000,
    placeholderData: keepPreviousData,
  })
}

export function schoolZonesQueryOptions(
  filter: SchoolZoneStatusFilter = 'all',
) {
  return queryOptions({
    queryKey: settingsKeys.zones(filter),
    queryFn: () => getSchoolZones(filter),
    staleTime: 30_000,
  })
}
