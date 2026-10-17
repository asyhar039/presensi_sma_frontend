import type { IDutyAssignmentParams } from '@/features/duty-teacher/assignments/types'

import { keepPreviousData, queryOptions } from '@tanstack/react-query'

import {
  getDutyAssignment,
  getDutyAssignments,
} from '@/features/duty-teacher/assignments/services'

export const dutyAssignmentKeys = {
  all: ['duty-assignments'] as const,
  lists: () => [...dutyAssignmentKeys.all, 'list'] as const,
  list: (params: IDutyAssignmentParams) =>
    [...dutyAssignmentKeys.lists(), params] as const,
  details: () => [...dutyAssignmentKeys.all, 'detail'] as const,
  detail: (id: number) => [...dutyAssignmentKeys.details(), id] as const,
}

export function dutyAssignmentsQueryOptions(params: IDutyAssignmentParams) {
  return queryOptions({
    queryKey: dutyAssignmentKeys.list(params),
    queryFn: () => getDutyAssignments(params),
    placeholderData: keepPreviousData,
    staleTime: 30_000,
  })
}

export function dutyAssignmentDetailQueryOptions(id: number | null) {
  return queryOptions({
    queryKey: dutyAssignmentKeys.detail(id ?? 0),
    queryFn: () => getDutyAssignment(id as number),
    enabled: typeof id === 'number' && Number.isFinite(id) && id > 0,
    staleTime: 30_000,
  })
}
