import type { IClassroomMemberParams } from '@/features/classrooms/types/classroom.types'

import { useQuery } from '@tanstack/react-query'

import {
  classroomDetailQueryOptions,
  classroomMembersQueryOptions,
} from '@/features/classrooms/lib/classroom-query-options'

export function useClassroomDetail(id: number | null, enabled = true) {
  const options = classroomDetailQueryOptions(id)
  return useQuery({ ...options, enabled: options.enabled && enabled })
}

export function useClassroomMembers(
  id: number | null,
  params: IClassroomMemberParams,
  enabled = true,
) {
  const options = classroomMembersQueryOptions(id ?? 0, params)
  const query = useQuery({
    ...options,
    enabled: typeof id === 'number' && Number.isFinite(id) && id > 0 && enabled,
  })
  return query
}
