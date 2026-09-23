import type {
  IAcademicYear,
  IAcademicYearListResult,
  IAcademicYearPaginationMeta,
  IAcademicYearParams,
  IAcademicYearPayload,
} from '@/features/academic-years/types/academic-year.types'

import { api, apiClient } from '@/services/api-client'

type RawListEnvelope = {
  message: string
  data: IAcademicYear[]
  meta: Partial<IAcademicYearPaginationMeta> & {
    limit?: number
  }
}

function normalizeMeta(
  meta: RawListEnvelope['meta'],
  fallbackPerPage: number,
): IAcademicYearPaginationMeta {
  const perPage = meta.per_page ?? meta.limit ?? fallbackPerPage
  return {
    page: meta.page ?? 1,
    per_page: perPage,
    total: meta.total ?? 0,
    total_pages: meta.total_pages ?? 0,
  }
}

export async function getAcademicYears(
  params: IAcademicYearParams,
): Promise<IAcademicYearListResult> {
  const cleaned = Object.fromEntries(
    Object.entries(params).filter(
      ([, value]) => value !== undefined && value !== null && value !== '',
    ),
  )
  const response = await apiClient.get<RawListEnvelope>('/academic-years', {
    params: cleaned,
  })
  const envelope = response.data
  return {
    items: envelope.data,
    meta: normalizeMeta(envelope.meta, params.per_page ?? 10),
  }
}

export function getAcademicYear(id: number) {
  return api.get<IAcademicYear>(`/academic-years/${id}`)
}

export function postAcademicYear(payload: IAcademicYearPayload) {
  return api.post<IAcademicYear>('/academic-years', payload)
}

export function putAcademicYear(id: number, payload: IAcademicYearPayload) {
  return api.put<IAcademicYear>(`/academic-years/${id}`, payload)
}

export function deleteAcademicYear(id: number) {
  return api.delete<null>(`/academic-years/${id}`)
}
