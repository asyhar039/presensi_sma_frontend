import { queryOptions } from '@tanstack/react-query'

import { getPresenceCurrent } from '@/features/teacher-session/services/teacher-session-api'

export const teacherSessionKeys = {
  all: ['teacher-session'] as const,
  current: () => [...teacherSessionKeys.all, 'current'] as const,
  lists: () => [...teacherSessionKeys.all, 'subject-leave-requests'] as const,
  detail: (id: number) => [...teacherSessionKeys.lists(), id] as const,
}

export function presenceCurrentQueryOptions() {
  return queryOptions({
    queryKey: teacherSessionKeys.current(),
    queryFn: getPresenceCurrent,
    staleTime: 10_000,
    refetchInterval: 30_000,
  })
}
