import type {
  ISubject,
  ISubjectListResult,
  ISubjectPaginationMeta,
  ISubjectParams,
  ISubjectPayload,
} from '@/features/subjects/types/subject.types'

import { api, apiClient } from '@/services/api-client'

type RawListEnvelope = {
  message: string
  data: ISubject[]
  meta: Partial<ISubjectPaginationMeta> & {
    limit?: number
  }
}

function normalizeMeta(
  meta: RawListEnvelope['meta'],
  fallbackPerPage: number,
): ISubjectPaginationMeta {
  const perPage = meta.per_page ?? meta.limit ?? fallbackPerPage
  return {
    page: meta.page ?? 1,
    per_page: perPage,
    total: meta.total ?? 0,
    total_pages: meta.total_pages ?? 0,
  }
}

export async function getSubjects(
  params: ISubjectParams,
): Promise<ISubjectListResult> {
  const cleaned = Object.fromEntries(
    Object.entries(params).filter(
      ([, value]) => value !== undefined && value !== null && value !== '',
    ),
  )
  const response = await apiClient.get<RawListEnvelope>('/subjects', {
    params: cleaned,
  })
  const envelope = response.data
  return {
    items: envelope.data,
    meta: normalizeMeta(envelope.meta, params.per_page ?? 10),
  }
}

export function getSubject(id: number) {
  return api.get<ISubject>(`/subjects/${id}`)
}

export function postSubject(payload: ISubjectPayload) {
  return api.post<ISubject>('/subjects', payload)
}

export function putSubject(id: number, payload: ISubjectPayload) {
  return api.put<ISubject>(`/subjects/${id}`, payload)
}

export function deleteSubject(id: number) {
  return api.delete<null>(`/subjects/${id}`)
}
