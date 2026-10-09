import { useQuery } from '@tanstack/react-query'

import { teacherDetailQueryOptions } from '@/features/teachers/lib/teacher-query-options'

export function useTeacherDetail(id: number | null, enabled = true) {
  const options = teacherDetailQueryOptions(id)
  return useQuery({ ...options, enabled: options.enabled && enabled })
}
