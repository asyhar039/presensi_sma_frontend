import type { IAttendanceParams } from '@/features/attendance/types/attendance.types'

import { useQuery } from '@tanstack/react-query'

import { attendanceKeys } from '@/features/attendance/lib/attendance-query-options'
import { getAttendanceSessions } from '@/features/attendance/services/attendance-api'

export function useAttendanceSessions(params: IAttendanceParams) {
  return useQuery({
    queryKey: attendanceKeys.list(params),
    queryFn: () => getAttendanceSessions(params),
    staleTime: 30_000,
  })
}
