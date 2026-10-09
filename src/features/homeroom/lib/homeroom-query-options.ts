import type { IHomeroomLeaveParams } from '@/features/homeroom/types/homeroom.types'

import { keepPreviousData, queryOptions } from '@tanstack/react-query'

import {
  getHomeroom,
  getHomeroomLeaveRequest,
  getHomeroomLeaveRequests,
} from '@/features/homeroom/services/homeroom-api'

export const homeroomKeys = {
  all: ['homeroom'] as const,
  info: () => [...homeroomKeys.all, 'info'] as const,
  lists: () => [...homeroomKeys.all, 'leave-requests'] as const,
  list: (params: IHomeroomLeaveParams) =>
    [...homeroomKeys.lists(), params] as const,
  details: () => [...homeroomKeys.all, 'leave-request'] as const,
  detail: (id: number) => [...homeroomKeys.details(), id] as const,
}

export function homeroomInfoQueryOptions() {
  return queryOptions({
    queryKey: homeroomKeys.info(),
    queryFn: getHomeroom,
    staleTime: 60_000,
  })
}

export function homeroomLeaveDetailQueryOptions(id: number | null) {
  return queryOptions({
    queryKey: homeroomKeys.detail(id ?? 0),
    queryFn: () => getHomeroomLeaveRequest(id as number),
    enabled: typeof id === 'number' && Number.isFinite(id) && id > 0,
    staleTime: 30_000,
  })
}

export function homeroomLeaveListQueryKey(params: IHomeroomLeaveParams) {
  return homeroomKeys.list(params)
}

export function homeroomLeaveListQueryOptions(params: IHomeroomLeaveParams) {
  return {
    queryKey: homeroomKeys.list(params),
    queryFn: () => getHomeroomLeaveRequests(params),
    placeholderData: keepPreviousData,
    staleTime: 30_000,
  }
}
