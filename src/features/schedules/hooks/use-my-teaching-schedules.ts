import { useQuery } from '@tanstack/react-query'

import { myTeachingSchedulesQueryOptions } from '@/features/schedules/lib/schedule-query-options'

export function useMyTeachingSchedules() {
  return useQuery(myTeachingSchedulesQueryOptions())
}
