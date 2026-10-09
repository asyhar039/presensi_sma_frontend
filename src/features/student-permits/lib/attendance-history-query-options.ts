import type { IStudentAttendanceHistoryParams } from '@/features/student-permits/types/attendance-history.types'

import { queryOptions } from '@tanstack/react-query'

import {
  getStudentAttendanceHistory,
  getStudentAttendanceSummary,
} from '@/features/student-permits/services/attendance-history-api'
import { getMonthlyCalendar } from '@/features/student-permits/services/presence-scan-api'
import { getStudentInformation } from '@/features/student-permits/services/student-permit-api'

export const studentAttendanceKeys = {
  all: ['student-attendance'] as const,
  history: (params: IStudentAttendanceHistoryParams) =>
    [...studentAttendanceKeys.all, 'history', params] as const,
  summary: () => [...studentAttendanceKeys.all, 'summary'] as const,
  calendar: (month: string) =>
    [...studentAttendanceKeys.all, 'calendar', month] as const,
}

export const studentInformationQueryOptions = () =>
  queryOptions({
    queryKey: [...studentAttendanceKeys.all, 'information'] as const,
    queryFn: getStudentInformation,
    staleTime: 60_000,
  })

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

export const monthlyCalendarQueryOptions = (month: string) =>
  queryOptions({
    queryKey: studentAttendanceKeys.calendar(month),
    queryFn: () => getMonthlyCalendar(month),
    staleTime: 30_000,
    enabled: month.length > 0,
  })
