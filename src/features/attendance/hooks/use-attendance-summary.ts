import type { IAttendanceSummaryParams } from '@/features/attendance/types/attendance.types'

import { useQuery } from '@tanstack/react-query'

import { getAttendanceSummary } from '@/features/attendance/services/attendance-api'

export function useAttendanceSummary(params: IAttendanceSummaryParams) {
  return useQuery({
    queryKey: ['attendance', 'summary', params],
    queryFn: () => getAttendanceSummary(params),
    staleTime: 30_000,
  })
}
