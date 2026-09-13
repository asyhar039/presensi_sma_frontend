import type {
  IClassroom,
  IClassroomListResult,
  IClassroomPaginationMeta,
  IClassroomParams,
  IClassroomPayload,
} from '@/features/classrooms/types/classroom.types'

import { api, apiClient } from '@/services/api-client'

type RawListEnvelope = {
  message: string
  data: IClassroom[]
  meta: Partial<IClassroomPaginationMeta> & {
    limit?: number
  }
}

function normalizeMeta(
  meta: RawListEnvelope['meta'],
  fallbackPerPage: number,
): IClassroomPaginationMeta {
  const perPage = meta.per_page ?? meta.limit ?? fallbackPerPage
  return {
    page: meta.page ?? 1,
    per_page: perPage,
    total: meta.total ?? 0,
    total_pages: meta.total_pages ?? 0,
  }
}

export async function getClassrooms(
  params: IClassroomParams,
): Promise<IClassroomListResult> {
  const normalized = { ...params }
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
  const cleaned = Object.fromEntries(
    Object.entries(normalized).filter(
      ([, value]) => value !== undefined && value !== null && value !== '',
    ),
  )
  const response = await apiClient.get<RawListEnvelope>('/classrooms', {
    params: cleaned,
  })
  const envelope = response.data
  return {
    items: envelope.data,
    meta: normalizeMeta(envelope.meta, params.per_page ?? 10),
  }
}

export function getClassroom(id: number) {
  return api.get<IClassroom>(`/classrooms/${id}`)
}

export function postClassroom(payload: IClassroomPayload) {
  return api.post<IClassroom>('/classrooms', payload)
}

export function putClassroom(id: number, payload: IClassroomPayload) {
  return api.put<IClassroom>(`/classrooms/${id}`, payload)
}

export function deleteClassroom(id: number) {
  return api.delete<null>(`/classrooms/${id}`)
}
