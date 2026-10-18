import type {
  IDutyAssignment,
  IDutyAssignmentListResult,
  IDutyAssignmentMeta,
  IDutyAssignmentParams,
  IDutyAssignmentPayload,
} from '@/features/duty-teacher/assignments/types'

import { api, apiClient } from '@/services/api-client'

type RawListEnvelope = {
  message: string
  data: IDutyAssignment[]
  meta: Partial<IDutyAssignmentMeta> & { limit?: number }
}

function cleanParams(params: Record<string, unknown>) {
  return Object.fromEntries(
    Object.entries(params).filter(
      ([, value]) => value !== undefined && value !== null && value !== '',
    ),
  )
}

function normalizeMeta(
  meta: RawListEnvelope['meta'],
  fallbackPerPage: number,
): IDutyAssignmentMeta {
  return {
    page: meta.page ?? 1,
    per_page: meta.per_page ?? meta.limit ?? fallbackPerPage,
    total: meta.total ?? 0,
    total_pages: meta.total_pages ?? 0,
  }
}

export async function getDutyAssignments(
  params: IDutyAssignmentParams,
): Promise<IDutyAssignmentListResult> {
  const response = await apiClient.get<RawListEnvelope>('/duty-teachers', {
    params: cleanParams({ ...params }),
  })
  return {
    items: response.data.data,
    meta: normalizeMeta(response.data.meta, params.per_page ?? 10),
  }
}

export function getDutyAssignment(id: number) {
  return api.get<IDutyAssignment>(`/duty-teachers/${id}`)
}

export function postDutyAssignment(payload: IDutyAssignmentPayload) {
  return api.post<null>('/duty-teachers', payload)
}

export function putDutyAssignment(
  id: number,
  payload: Partial<IDutyAssignmentPayload>,
) {
  return api.put<null>(`/duty-teachers/${id}`, payload)
}

export function deleteDutyAssignment(id: number) {
  return api.delete<null>(`/duty-teachers/${id}`)
}
