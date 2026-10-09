import type { ITeacherParams } from '@/features/teachers/types/teacher.types'

import { keepPreviousData, queryOptions } from '@tanstack/react-query'

import {
  getTeacher,
  getTeachers,
} from '@/features/teachers/services/teacher-api'

export const teacherKeys = {
  all: ['teachers'] as const,
  lists: () => [...teacherKeys.all, 'list'] as const,
  list: (params: ITeacherParams) => [...teacherKeys.lists(), params] as const,
  details: () => [...teacherKeys.all, 'detail'] as const,
  detail: (id: number) => [...teacherKeys.details(), id] as const,
}

export function teachersQueryOptions(params: ITeacherParams) {
  return queryOptions({
    queryKey: teacherKeys.list(params),
    queryFn: () => getTeachers(params),
    placeholderData: keepPreviousData,
    staleTime: 30_000,
  })
}

export function teacherDetailQueryOptions(id: number | null) {
  return queryOptions({
    queryKey: teacherKeys.detail(id ?? 0),
    queryFn: () => getTeacher(id as number),
    enabled: typeof id === 'number' && Number.isFinite(id) && id > 0,
    staleTime: 30_000,
  })
}
