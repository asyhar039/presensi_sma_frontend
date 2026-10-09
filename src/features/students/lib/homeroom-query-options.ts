import type { IHomeroomStudentParams } from '@/features/students/types/homeroom.types'

import { keepPreviousData, queryOptions } from '@tanstack/react-query'

import {
  getHomeroom,
  getHomeroomStudent,
} from '@/features/students/services/homeroom-api'

export const homeroomKeys = {
  all: ['homeroom'] as const,
  info: () => [...homeroomKeys.all, 'info'] as const,
  studentLists: () => [...homeroomKeys.all, 'student-list'] as const,
  studentList: (params: IHomeroomStudentParams) =>
    [...homeroomKeys.studentLists(), params] as const,
  studentDetails: () => [...homeroomKeys.all, 'student-detail'] as const,
  studentDetail: (id: number) =>
    [...homeroomKeys.studentDetails(), id] as const,
}

export function homeroomQueryOptions() {
  return queryOptions({
    queryKey: homeroomKeys.info(),
    queryFn: getHomeroom,
    staleTime: 60_000,
  })
}

export function homeroomStudentDetailQueryOptions(id: number | null) {
  return queryOptions({
    queryKey: homeroomKeys.studentDetail(id ?? 0),
    queryFn: () => getHomeroomStudent(id as number),
    enabled: typeof id === 'number' && Number.isFinite(id) && id > 0,
    staleTime: 30_000,
  })
}

export function homeroomStudentsPlaceholder() {
  return { placeholderData: keepPreviousData, staleTime: 30_000 }
}
