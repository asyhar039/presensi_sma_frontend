import { useQuery } from '@tanstack/react-query'

import { publicHolidaysQueryOptions } from '@/features/settings/lib/settings-query-options'

export function usePublicHolidays(month?: string) {
  return useQuery(publicHolidaysQueryOptions(month))
}
