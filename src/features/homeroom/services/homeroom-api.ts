import type {
  IHomeroomDecisionPayload,
  IHomeroomInfo,
  IHomeroomLeaveDetail,
  IHomeroomLeaveItem,
  IHomeroomLeaveListResult,
  IHomeroomLeaveParams,
} from '@/features/homeroom/types/homeroom.types'

import { api, apiClient } from '@/services/api-client'

export function getHomeroom() {
  return api.get<IHomeroomInfo>('/homeroom')
}

type RawLeaveListEnvelope = {
  message: string
  data: IHomeroomLeaveItem[]
  meta: {
    page: number
    per_page?: number
    limit?: number
    total: number
    total_pages: number
  }
}

export async function getHomeroomLeaveRequests(
  params: IHomeroomLeaveParams,
): Promise<IHomeroomLeaveListResult> {
  const cleaned = Object.fromEntries(
    Object.entries(params).filter(
      ([, value]) => value !== undefined && value !== null && value !== '',
    ),
  )
  const response = await apiClient.get<RawLeaveListEnvelope>(
    '/homeroom/leave-requests',
    { params: cleaned },
  )
  const envelope = response.data
  return {
    items: envelope.data,
    meta: {
      page: envelope.meta.page ?? 1,
      per_page:
        envelope.meta.per_page ?? envelope.meta.limit ?? params.per_page ?? 10,
      total: envelope.meta.total ?? 0,
      total_pages: envelope.meta.total_pages ?? 0,
    },
  }
}

export function getHomeroomLeaveRequest(id: number) {
  return api.get<IHomeroomLeaveDetail>(`/homeroom/leave-requests/${id}`)
}

export function decideHomeroomLeaveRequest(
  id: number,
  payload: IHomeroomDecisionPayload,
) {
  return api.post<null>(`/homeroom/leave-requests/${id}/decision`, payload)
}
