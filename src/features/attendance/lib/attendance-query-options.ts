import type { IAttendanceParams } from '@/features/attendance/types/attendance.types'

import { keepPreviousData, queryOptions } from '@tanstack/react-query'

import {
  getAttendanceLogs,
  getAttendanceRequests,
  getAttendanceSession,
  getAttendanceSessions,
} from '@/features/attendance/services/attendance-api'

export const attendanceKeys = {
  all: ['attendance'] as const,
  lists: () => [...attendanceKeys.all, 'list'] as const,
  list: (params: IAttendanceParams) =>
    [...attendanceKeys.lists(), params] as const,
  details: () => [...attendanceKeys.all, 'detail'] as const,
  detail: (id: number) => [...attendanceKeys.details(), id] as const,
  logs: () => [...attendanceKeys.all, 'logs'] as const,
  logsList: (params: IAttendanceParams) =>
    [...attendanceKeys.logs(), params] as const,
  requests: () => [...attendanceKeys.all, 'requests'] as const,
  requestsList: (params: IAttendanceParams) =>
    [...attendanceKeys.requests(), params] as const,
}

export function attendanceSessionsQueryOptions(params: IAttendanceParams) {
  return queryOptions({
    queryKey: attendanceKeys.list(params),
    queryFn: () => getAttendanceSessions(params),
    placeholderData: keepPreviousData,
    staleTime: 30_000,
  })
}

export function attendanceLogsQueryOptions(params: IAttendanceParams) {
  return queryOptions({
    queryKey: attendanceKeys.logsList(params),
    queryFn: () => getAttendanceLogs(params),
    placeholderData: keepPreviousData,
    staleTime: 30_000,
  })
}

export function attendanceRequestsQueryOptions(params: IAttendanceParams) {
  return queryOptions({
    queryKey: attendanceKeys.requestsList(params),
    queryFn: () => getAttendanceRequests(params),
    placeholderData: keepPreviousData,
    staleTime: 30_000,
  })
}

export function attendanceDetailQueryOptions(id: number | null) {
  return queryOptions({
    queryKey: attendanceKeys.detail(id ?? 0),
    queryFn: () => getAttendanceSession(id as number),
    enabled: typeof id === 'number' && Number.isFinite(id) && id > 0,
    staleTime: 30_000,
  })
}
