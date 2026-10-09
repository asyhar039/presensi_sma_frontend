import type {
  DataTableApiParams,
  DataTableListResult,
} from '@/components/data-table'
import type {
  IPresenceCurrent,
  IRefreshQR,
  ISubjectLeaveDetail,
  ISubjectLeaveRow,
} from '@/features/teacher-session/types/teacher-session.types'

import { api } from '@/services/api-client'

export function getPresenceCurrent() {
  return api.get<IPresenceCurrent>('/presence/current')
}

export function startPresenceSession() {
  return api.post<null>('/presence/start')
}

export function stopPresenceSession() {
  return api.post<null>('/presence/stop')
}

export function refreshPresenceQR() {
  return api
    .get<IRefreshQR>('/presence/refresh')
    .catch(() => api.post<IRefreshQR>('/presence/refresh'))
}

export async function getSubjectLeaveRequests(
  params: DataTableApiParams,
): Promise<DataTableListResult<ISubjectLeaveRow>> {
  const res = await api.paginate<ISubjectLeaveRow>('/subject/leave-requests', {
    params,
  })
  return {
    items: res.data,
    meta: {
      page: res.meta.page,
      per_page: res.meta.limit,
      total: res.meta.total,
      total_pages: res.meta.total_pages,
    },
  }
}

export function getSubjectLeaveDetail(id: number) {
  return api.get<ISubjectLeaveDetail>(`/subject/leave-requests/${id}`)
}

export function decideSubjectLeave(
  id: number,
  decision: 'approved' | 'rejected',
  notes?: string,
) {
  return api.post<ISubjectLeaveDetail>(
    `/subject/leave-requests/${id}/early-out/decision`,
    { decision, ...(notes ? { notes } : {}) },
  )
}

export function authBroadcastChannel(socketId: string, channel: string) {
  return api.get<unknown>('/broadcasting/auth', {
    params: { socket_id: socketId, channel_name: channel },
  })
}
