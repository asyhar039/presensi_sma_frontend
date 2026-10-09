import type { ISubjectParams } from '@/features/subjects/types/subject.types'

import { keepPreviousData, queryOptions } from '@tanstack/react-query'

import {
  getSubject,
  getSubjects,
} from '@/features/subjects/services/subject-api'

export const subjectKeys = {
  all: ['subjects'] as const,
  lists: () => [...subjectKeys.all, 'list'] as const,
  list: (params: ISubjectParams) => [...subjectKeys.lists(), params] as const,
  details: () => [...subjectKeys.all, 'detail'] as const,
  detail: (id: number) => [...subjectKeys.details(), id] as const,
}

export function subjectsQueryOptions(params: ISubjectParams) {
  return queryOptions({
    queryKey: subjectKeys.list(params),
    queryFn: () => getSubjects(params),
    placeholderData: keepPreviousData,
    staleTime: 30_000,
  })
}

export function subjectDetailQueryOptions(id: number | null) {
  return queryOptions({
    queryKey: subjectKeys.detail(id ?? 0),
    queryFn: () => getSubject(id as number),
    enabled: typeof id === 'number' && Number.isFinite(id) && id > 0,
    staleTime: 30_000,
  })
}
