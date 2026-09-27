import type { IStudentAttendanceHistoryParams } from '@/features/student-permits/types/attendance-history.types'

import { queryOptions } from '@tanstack/react-query'

import {
  getStudentAttendanceHistory,
  getStudentAttendanceSummary,
} from '@/features/student-permits/services/attendance-history-api'

export const studentAttendanceKeys = {
  all: ['student-attendance'] as const,
  history: (params: IStudentAttendanceHistoryParams) =>
    [...studentAttendanceKeys.all, 'history', params] as const,
  summary: () => [...studentAttendanceKeys.all, 'summary'] as const,
}

export const studentAttendanceHistoryQueryOptions = (
  params: IStudentAttendanceHistoryParams,
) =>
  queryOptions({
    queryKey: studentAttendanceKeys.history(params),
    queryFn: () => getStudentAttendanceHistory(params),
    staleTime: 30_000,
  })

export const studentAttendanceSummaryQueryOptions = () =>
  queryOptions({
    queryKey: studentAttendanceKeys.summary(),
    queryFn: getStudentAttendanceSummary,
    staleTime: 30_000,
  })
