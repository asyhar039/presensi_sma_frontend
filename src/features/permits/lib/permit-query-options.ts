import type { IPermitParams } from '@/features/permits/types/permit.types'

import { keepPreviousData, queryOptions } from '@tanstack/react-query'

import {
  getPermitStatistics,
  getPermits,
} from '@/features/permits/services/permit-api'

export const permitKeys = {
  all: ['permits'] as const,
  lists: () => [...permitKeys.all, 'list'] as const,
  list: (params: IPermitParams) => [...permitKeys.lists(), params] as const,
  statistics: () => [...permitKeys.all, 'statistics'] as const,
}

export function permitQueryOptions(params: IPermitParams) {
  return queryOptions({
    queryKey: permitKeys.list(params),
    queryFn: () => getPermits(params),
    placeholderData: keepPreviousData,
    staleTime: 30_000,
  })
}

export function permitStatisticsQueryOptions() {
  return queryOptions({
    queryKey: permitKeys.statistics(),
    queryFn: () => getPermitStatistics(),
    staleTime: 60_000,
  })
}
