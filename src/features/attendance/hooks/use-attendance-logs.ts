import type { IAttendanceLogParams } from '@/features/attendance/types/attendance.types'

import { useQuery } from '@tanstack/react-query'

import { attendanceKeys } from '@/features/attendance/lib/attendance-query-options'
import { getAttendanceLogs } from '@/features/attendance/services/attendance-api'

export function useAttendanceLogs(params: IAttendanceLogParams) {
  return useQuery({
    queryKey: attendanceKeys.logsList(params),
    queryFn: () => getAttendanceLogs(params),
    staleTime: 30_000,
  })
}
