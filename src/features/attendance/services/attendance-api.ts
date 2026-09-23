import type {
  IAttendanceListResult,
  IAttendanceLog,
  IAttendanceLogListResult,
  IAttendanceLogParams,
  IAttendanceParams,
  IAttendanceRequest,
  IAttendanceRequestListResult,
  IAttendanceRequestParams,
  IAttendanceRequestPayload,
  IAttendanceSession,
  IAttendanceSessionDetail,
  IAttendanceSessionPayload,
  IAttendanceSummary,
  IAttendanceSummaryParams,
} from '@/features/attendance/types/attendance.types'

import { api, apiClient } from '@/services/api-client'

type RawListEnvelope<T> = {
  message: string
  data: T[]
  meta: {
    page: number
    per_page: number
    total: number
    total_pages: number
  }
}

function normalizeMeta(meta: RawListEnvelope<unknown>['meta']) {
  return {
    page: meta.page ?? 1,
    per_page: meta.per_page ?? 10,
    total: meta.total ?? 0,
    total_pages: meta.total_pages ?? 0,
  }
}

export async function getAttendanceSessions(
  params: IAttendanceParams,
): Promise<IAttendanceListResult> {
  const cleaned = Object.fromEntries(
    Object.entries(params).filter(
      ([, value]) => value !== undefined && value !== null && value !== '',
    ),
  )
  const response = await apiClient.get<RawListEnvelope<IAttendanceSession>>(
    '/attendance/sessions',
    { params: cleaned },
  )
  return {
    items: response.data.data,
    meta: normalizeMeta(response.data.meta),
  }
}

export function getAttendanceSession(id: number) {
  return api.get<IAttendanceSessionDetail>(`/attendance/sessions/${id}`)
}

export function postAttendanceSession(payload: IAttendanceSessionPayload) {
  return api.post<IAttendanceSession>('/attendance/sessions', payload)
}

export function putAttendanceSession(
  id: number,
  payload: IAttendanceSessionPayload,
) {
  return api.put<IAttendanceSession>(`/attendance/sessions/${id}`, payload)
}

export function deleteAttendanceSession(id: number) {
  return api.delete<null>(`/attendance/sessions/${id}`)
}

export function postCloseAttendanceSession(id: number) {
  return api.post<null>(`/attendance/sessions/${id}/close`)
}

export async function getAttendanceLogs(
  params: IAttendanceLogParams,
): Promise<IAttendanceLogListResult> {
  const cleaned = Object.fromEntries(
    Object.entries(params).filter(
      ([, value]) => value !== undefined && value !== null && value !== '',
    ),
  )
  const response = await apiClient.get<RawListEnvelope<IAttendanceLog>>(
    '/attendance/logs',
    { params: cleaned },
  )
  return {
    items: response.data.data,
    meta: normalizeMeta(response.data.meta),
  }
}

export async function getAttendanceRequests(
  params: IAttendanceRequestParams,
): Promise<IAttendanceRequestListResult> {
  const cleaned = Object.fromEntries(
    Object.entries(params).filter(
      ([, value]) => value !== undefined && value !== null && value !== '',
    ),
  )
  const response = await apiClient.get<RawListEnvelope<IAttendanceRequest>>(
    '/attendance/requests',
    { params: cleaned },
  )
  return {
    items: response.data.data,
    meta: normalizeMeta(response.data.meta),
  }
}

export function postAttendanceRequest(payload: IAttendanceRequestPayload) {
  return api.post<IAttendanceRequest>('/attendance/requests', payload)
}

export function postApproveAttendanceRequest(id: number) {
  return api.post<null>(`/attendance/requests/${id}/approve`)
}

export function postRejectAttendanceRequest(id: number) {
  return api.post<null>(`/attendance/requests/${id}/reject`)
}

export async function getAttendanceSummary(
  params: IAttendanceSummaryParams,
): Promise<IAttendanceSummary> {
  const cleaned = Object.fromEntries(
    Object.entries(params).filter(
      ([, value]) => value !== undefined && value !== null && value !== '',
    ),
  )
  const response = await apiClient.get<{ data: IAttendanceSummary }>(
    '/attendance/summary',
    { params: cleaned },
  )
  return response.data.data
}
