import { useQuery } from '@tanstack/react-query'

import { attendanceDetailQueryOptions } from '@/features/attendance/lib/attendance-query-options'

export function useAttendanceDetail(id: number | null, enabled = true) {
  const options = attendanceDetailQueryOptions(id)
  return useQuery({ ...options, enabled: options.enabled && enabled })
}
