import { queryOptions } from '@tanstack/react-query'

import { getDutyStatus } from '@/features/duty-teacher/services/duty-teacher-api'

export const dutyKeys = {
  all: ['duty-teacher'] as const,
  status: () => [...dutyKeys.all, 'status'] as const,
  lists: () => [...dutyKeys.all, 'leave-requests'] as const,
  detail: (id: number) => [...dutyKeys.lists(), id] as const,
}

export function dutyStatusQueryOptions() {
  return queryOptions({
    queryKey: dutyKeys.status(),
    queryFn: getDutyStatus,
    staleTime: 60_000,
  })
}
