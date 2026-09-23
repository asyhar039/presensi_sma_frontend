import type {
  IScheduleEntry,
  IScheduleListResult,
  ISchedulePaginationMeta,
  IScheduleParams,
  IScheduleSummary,
} from '@/features/schedules/types/schedule.types'

import { apiClient } from '@/services/api-client'

type RawListEnvelope = {
  message: string
  data: IScheduleEntry[]
  meta: Partial<ISchedulePaginationMeta> & {
    limit?: number
  }
}

type RawSummaryEnvelope = {
  message: string
  data: IScheduleSummary
}

function normalizeMeta(
  meta: RawListEnvelope['meta'],
  fallbackPerPage: number,
): ISchedulePaginationMeta {
  const perPage = meta.per_page ?? meta.limit ?? fallbackPerPage
  return {
    page: meta.page ?? 1,
    per_page: perPage,
    total: meta.total ?? 0,
    total_pages: meta.total_pages ?? 0,
  }
}

export async function getSchedules(
  params: IScheduleParams,
): Promise<IScheduleListResult> {
  const normalized: Record<string, unknown> = { ...params }
  if (
    normalized.academic_year_id === undefined ||
    normalized.academic_year_id === null ||
    normalized.academic_year_id === '' ||
    normalized.academic_year_id === 'all'
  ) {
    delete normalized.academic_year_id
  } else {
    const parsed = Number(normalized.academic_year_id)
    if (Number.isFinite(parsed) && parsed > 0) {
      normalized.academic_year_id = parsed
    } else {
      delete normalized.academic_year_id
    }
  }
  if (
    normalized.semester === undefined ||
    normalized.semester === null ||
    normalized.semester === '' ||
    (normalized.semester as string) === 'all'
  ) {
    delete normalized.semester
  }
  const cleaned = Object.fromEntries(
    Object.entries(normalized).filter(
      ([, value]) => value !== undefined && value !== null && value !== '',
    ),
  )
  const response = await apiClient.get<RawListEnvelope>('/schedules', {
    params: cleaned,
  })
  const envelope = response.data
  return {
    items: envelope.data,
    meta: normalizeMeta(envelope.meta, params.per_page ?? 50),
  }
}

export async function getScheduleSummary(
  params: Pick<IScheduleParams, 'semester' | 'academic_year_id'>,
): Promise<IScheduleSummary | null> {
  try {
    const cleaned = Object.fromEntries(
      Object.entries(params).filter(
        ([, value]) => value !== undefined && value !== null && value !== '',
      ),
    )
    const response = await apiClient.get<RawSummaryEnvelope>(
      '/schedules/summary',
      { params: cleaned },
    )
    return response.data.data
  } catch {
    return null
  }
}

export async function exportSchedules(
  params: Pick<IScheduleParams, 'semester' | 'academic_year_id'>,
): Promise<Blob> {
  const cleaned = Object.fromEntries(
    Object.entries(params).filter(
      ([, value]) => value !== undefined && value !== null && value !== '',
    ),
  )
  const response = await apiClient.get('/schedules/export', {
    params: cleaned,
    responseType: 'blob',
  })
  return response.data as Blob
}
