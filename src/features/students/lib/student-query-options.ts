import type { IStudentParams } from '@/features/students/types/student.types'

import { keepPreviousData, queryOptions } from '@tanstack/react-query'

import {
  getStudent,
  getStudents,
} from '@/features/students/services/student-api'

export const studentKeys = {
  all: ['students'] as const,
  lists: () => [...studentKeys.all, 'list'] as const,
  list: (params: IStudentParams) => [...studentKeys.lists(), params] as const,
  details: () => [...studentKeys.all, 'detail'] as const,
  detail: (id: number) => [...studentKeys.details(), id] as const,
}

export function studentsQueryOptions(params: IStudentParams) {
  return queryOptions({
    queryKey: studentKeys.list(params),
    queryFn: () => getStudents(params),
    placeholderData: keepPreviousData,
    staleTime: 30_000,
  })
}

export function studentDetailQueryOptions(id: number | null) {
  return queryOptions({
    queryKey: studentKeys.detail(id ?? 0),
    queryFn: () => getStudent(id as number),
    enabled: typeof id === 'number' && Number.isFinite(id) && id > 0,
    staleTime: 30_000,
  })
}
