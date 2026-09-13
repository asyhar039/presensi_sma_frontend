import type {
  IStudent,
  IStudentCreatePayload,
  IStudentListResult,
  IStudentPaginationMeta,
  IStudentParams,
  IStudentPasswordPayload,
  IStudentPayload,
} from '@/features/students/types/student.types'

import { api, apiClient } from '@/services/api-client'

type RawListEnvelope = {
  message: string
  data: IStudent[]
  meta: Partial<IStudentPaginationMeta> & {
    limit?: number
  }
}

function normalizeMeta(
  meta: RawListEnvelope['meta'],
  fallbackPerPage: number,
): IStudentPaginationMeta {
  const perPage = meta.per_page ?? meta.limit ?? fallbackPerPage
  return {
    page: meta.page ?? 1,
    per_page: perPage,
    total: meta.total ?? 0,
    total_pages: meta.total_pages ?? 0,
  }
}

export async function getStudents(
  params: IStudentParams,
): Promise<IStudentListResult> {
  const cleaned = Object.fromEntries(
    Object.entries(params).filter(
      ([, value]) => value !== undefined && value !== null && value !== '',
    ),
  )
  const response = await apiClient.get<RawListEnvelope>('/students', {
    params: cleaned,
  })
  const envelope = response.data
  return {
    items: envelope.data,
    meta: normalizeMeta(envelope.meta, params.per_page ?? 10),
  }
}

export function getStudent(id: number) {
  return api.get<IStudent>(`/students/${id}`)
}

export function postStudent(payload: IStudentCreatePayload) {
  return api.post<IStudent>('/students', payload)
}

export function putStudent(id: number, payload: IStudentPayload) {
  return api.put<IStudent>(`/students/${id}`, payload)
}

export function deleteStudent(id: number) {
  return api.delete<null>(`/students/${id}`)
}

export function putStudentPassword(
  id: number,
  payload: IStudentPasswordPayload,
) {
  return api.put<IStudent>(`/students/${id}/password`, payload)
}
