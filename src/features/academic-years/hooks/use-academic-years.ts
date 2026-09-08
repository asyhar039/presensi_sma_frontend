import type { IAcademicYearParams } from '@/features/academic-years/types/academic-year.types'

import { useQuery } from '@tanstack/react-query'

import { academicYearsQueryOptions } from '@/features/academic-years/lib/academic-year-query-options'

export function useAcademicYears(params: IAcademicYearParams) {
  return useQuery(academicYearsQueryOptions(params))
}
