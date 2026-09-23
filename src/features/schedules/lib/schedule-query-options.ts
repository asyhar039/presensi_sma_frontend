import type {
  IScheduleParams,
  IScheduleSummary,
} from '@/features/schedules/types/schedule.types'

import { keepPreviousData, queryOptions } from '@tanstack/react-query'

import { getScheduleSummary, getSchedules } from '../services/schedule-api'

export const scheduleKeys = {
  all: ['schedules'] as const,
  lists: () => [...scheduleKeys.all, 'list'] as const,
  list: (params: IScheduleParams) => [...scheduleKeys.lists(), params] as const,
  summary: (params: Pick<IScheduleParams, 'semester' | 'academic_year_id'>) =>
    [...scheduleKeys.all, 'summary', params] as const,
}

export function scheduleListQueryOptions(params: IScheduleParams) {
  return queryOptions({
    queryKey: scheduleKeys.list(params),
    queryFn: () => getSchedules(params),
    placeholderData: keepPreviousData,
    staleTime: 30_000,
  })
}

export function scheduleSummaryQueryOptions(
  params: Pick<IScheduleParams, 'semester' | 'academic_year_id'>,
) {
  return queryOptions<IScheduleSummary | null>({
    queryKey: scheduleKeys.summary(params),
    queryFn: () => getScheduleSummary(params),
    placeholderData: keepPreviousData,
    staleTime: 30_000,
  })
}
