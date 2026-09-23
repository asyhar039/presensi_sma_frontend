import type {
  ITeacher,
  ITeacherCreatePayload,
  ITeacherListResult,
  ITeacherPaginationMeta,
  ITeacherParams,
  ITeacherPasswordPayload,
  ITeacherPayload,
} from '@/features/teachers/types/teacher.types'

import { api, apiClient } from '@/services/api-client'

type RawListEnvelope = {
  message: string
  data: ITeacher[]
  meta: Partial<ITeacherPaginationMeta> & {
    limit?: number
  }
}

function normalizeMeta(
  meta: RawListEnvelope['meta'],
  fallbackPerPage: number,
): ITeacherPaginationMeta {
  const perPage = meta.per_page ?? meta.limit ?? fallbackPerPage
  return {
    page: meta.page ?? 1,
    per_page: perPage,
    total: meta.total ?? 0,
    total_pages: meta.total_pages ?? 0,
  }
}

export async function getTeachers(
  params: ITeacherParams,
): Promise<ITeacherListResult> {
  const cleaned = Object.fromEntries(
    Object.entries(params).filter(
      ([, value]) => value !== undefined && value !== null && value !== '',
    ),
  )
  const response = await apiClient.get<RawListEnvelope>('/teachers', {
    params: cleaned,
  })
  const envelope = response.data
  return {
    items: envelope.data,
    meta: normalizeMeta(envelope.meta, params.per_page ?? 10),
  }
}

export function getTeacher(id: number) {
  return api.get<ITeacher>(`/teachers/${id}`)
}

export function postTeacher(payload: ITeacherCreatePayload) {
  return api.post<ITeacher>('/teachers', payload)
}

export function putTeacher(id: number, payload: ITeacherPayload) {
  return api.put<ITeacher>(`/teachers/${id}`, payload)
}

export function deleteTeacher(id: number) {
  return api.delete<null>(`/teachers/${id}`)
}

export function putTeacherPassword(
  id: number,
  payload: ITeacherPasswordPayload,
) {
  return api.put<ITeacher>(`/teachers/${id}/password`, payload)
}
