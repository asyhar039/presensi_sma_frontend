import type {
  IClassroomMemberParams,
  IClassroomParams,
} from '@/features/classrooms/types/classroom.types'

import { keepPreviousData, queryOptions } from '@tanstack/react-query'

import {
  getClassroom,
  getClassroomMembers,
  getClassrooms,
} from '@/features/classrooms/services/classroom-api'

export const classroomKeys = {
  all: ['classrooms'] as const,
  lists: () => [...classroomKeys.all, 'list'] as const,
  list: (params: IClassroomParams) =>
    [...classroomKeys.lists(), params] as const,
  details: () => [...classroomKeys.all, 'detail'] as const,
  detail: (id: number) => [...classroomKeys.details(), id] as const,
  members: (id: number, params: IClassroomMemberParams) =>
    [...classroomKeys.detail(id), 'members', params] as const,
}

export function classroomsQueryOptions(params: IClassroomParams) {
  return queryOptions({
    queryKey: classroomKeys.list(params),
    queryFn: () => getClassrooms(params),
    placeholderData: keepPreviousData,
    staleTime: 30_000,
  })
}

export function classroomDetailQueryOptions(id: number | null) {
  return queryOptions({
    queryKey: classroomKeys.detail(id ?? 0),
    queryFn: () => getClassroom(id as number),
    enabled: typeof id === 'number' && Number.isFinite(id) && id > 0,
    staleTime: 30_000,
  })
}

export function classroomMembersQueryOptions(
  id: number,
  params: IClassroomMemberParams,
) {
  return queryOptions({
    queryKey: classroomKeys.members(id, params),
    queryFn: () => getClassroomMembers(id, params),
    placeholderData: keepPreviousData,
    staleTime: 30_000,
  })
}
