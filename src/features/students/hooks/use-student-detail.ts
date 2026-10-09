import { useQuery } from '@tanstack/react-query'

import { studentDetailQueryOptions } from '@/features/students/lib/student-query-options'

export function useStudentDetail(id: number | null, enabled = true) {
  const options = studentDetailQueryOptions(id)
  return useQuery({ ...options, enabled: options.enabled && enabled })
}
