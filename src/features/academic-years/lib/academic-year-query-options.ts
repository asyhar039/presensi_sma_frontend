import type { IAcademicYearParams } from '@/features/academic-years/types/academic-year.types'

import { keepPreviousData, queryOptions } from '@tanstack/react-query'

import {
  getAcademicYear,
  getAcademicYears,
} from '@/features/academic-years/services/academic-year-api'

export const academicYearKeys = {
  all: ['academic-years'] as const,
  lists: () => [...academicYearKeys.all, 'list'] as const,
  list: (params: IAcademicYearParams) =>
    [...academicYearKeys.lists(), params] as const,
  details: () => [...academicYearKeys.all, 'detail'] as const,
  detail: (id: number) => [...academicYearKeys.details(), id] as const,
}

export function academicYearsQueryOptions(params: IAcademicYearParams) {
  return queryOptions({
    queryKey: academicYearKeys.list(params),
    queryFn: () => getAcademicYears(params),
    placeholderData: keepPreviousData,
    staleTime: 30_000,
  })
}

export function academicYearDetailQueryOptions(id: number | null) {
  return queryOptions({
    queryKey: academicYearKeys.detail(id ?? 0),
    queryFn: () => getAcademicYear(id as number),
    enabled: typeof id === 'number' && Number.isFinite(id) && id > 0,
    staleTime: 30_000,
  })
}
