import { useQuery } from '@tanstack/react-query'

import { subjectDetailQueryOptions } from '@/features/subjects/lib/subject-query-options'

export function useSubjectDetail(id: number | null, enabled = true) {
  const options = subjectDetailQueryOptions(id)
  return useQuery({ ...options, enabled: options.enabled && enabled })
}
