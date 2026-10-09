import { useQuery } from '@tanstack/react-query'

import { academicYearDetailQueryOptions } from '@/features/academic-years/lib/academic-year-query-options'

export function useAcademicYearDetail(id: number | null, enabled = true) {
  const options = academicYearDetailQueryOptions(id)
  return useQuery({ ...options, enabled: options.enabled && enabled })
}
