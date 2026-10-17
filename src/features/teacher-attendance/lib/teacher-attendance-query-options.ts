import type { ITeacherAttendanceDetailParams } from '@/features/teacher-attendance/types/teacher-attendance.types'

import { queryOptions } from '@tanstack/react-query'

import { getTeacherStudentHistoryDetail } from '@/features/teacher-attendance/services/teacher-attendance-api'

export const teacherAttendanceKeys = {
  all: ['teacher-attendance'] as const,
  lists: () => [...teacherAttendanceKeys.all, 'list'] as const,
  details: () => [...teacherAttendanceKeys.all, 'detail'] as const,
  detail: (studentId: number, params: ITeacherAttendanceDetailParams) =>
    [...teacherAttendanceKeys.details(), studentId, params] as const,
}

export function teacherStudentHistoryQueryOptions(
  studentId: number,
  params: ITeacherAttendanceDetailParams,
) {
  return queryOptions({
    queryKey: teacherAttendanceKeys.detail(studentId, params),
    queryFn: () => getTeacherStudentHistoryDetail(studentId, params),
    enabled:
      Number.isFinite(studentId) &&
      studentId > 0 &&
      params.month >= 1 &&
      params.month <= 12 &&
      params.year >= 2000 &&
      params.year <= 2100,
    staleTime: 30_000,
  })
}
