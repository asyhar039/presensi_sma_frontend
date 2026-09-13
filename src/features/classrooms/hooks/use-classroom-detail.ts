import { useQuery } from '@tanstack/react-query'

import { classroomDetailQueryOptions } from '@/features/classrooms/lib/classroom-query-options'

export function useClassroomDetail(id: number | null, enabled = true) {
  const options = classroomDetailQueryOptions(id)
  return useQuery({ ...options, enabled: options.enabled && enabled })
}
