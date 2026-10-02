import type { IAttendanceParams } from '@/features/attendance/types/attendance.types'

import { keepPreviousData, queryOptions } from '@tanstack/react-query'

import {
  getAttendanceRecords,
  getStudentAttendanceDetail,
} from '@/features/attendance/services/attendance-api'

export const attendanceKeys = {
  all: ['attendance'] as const,
  lists: () => [...attendanceKeys.all, 'list'] as const,
  list: (params: IAttendanceParams) =>
    [...attendanceKeys.lists(), params] as const,
  details: () => [...attendanceKeys.all, 'detail'] as const,
  detail: (id: number) => [...attendanceKeys.details(), id] as const,
}

export function attendanceQueryOptions(params: IAttendanceParams) {
  return queryOptions({
    queryKey: attendanceKeys.list(params),
    queryFn: () => getAttendanceRecords(params),
    placeholderData: keepPreviousData,
    staleTime: 30_000,
  })
}

export function studentAttendanceDetailQueryOptions(
  studentId: number,
  params: IAttendanceParams,
) {
  return queryOptions({
    queryKey: attendanceKeys.detail(studentId),
    queryFn: () => getStudentAttendanceDetail(studentId, params),
    enabled:
      typeof studentId === 'number' &&
      Number.isFinite(studentId) &&
      studentId > 0,
    staleTime: 30_000,
  })
}
