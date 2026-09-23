import type { IAttendanceRequestParams } from '@/features/attendance/types/attendance.types'

import { useQuery } from '@tanstack/react-query'

import { attendanceKeys } from '@/features/attendance/lib/attendance-query-options'
import { getAttendanceRequests } from '@/features/attendance/services/attendance-api'

export function useAttendanceRequests(params: IAttendanceRequestParams) {
  return useQuery({
    queryKey: attendanceKeys.requestsList(params),
    queryFn: () => getAttendanceRequests(params),
    staleTime: 30_000,
  })
}
