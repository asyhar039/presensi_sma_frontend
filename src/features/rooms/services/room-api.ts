import type {
  IRoom,
  IRoomListResult,
  IRoomPaginationMeta,
  IRoomParams,
  IRoomPayload,
} from '@/features/rooms/types/room.types'

import { api, apiClient } from '@/services/api-client'

type RawListEnvelope = {
  message: string
  data: IRoom[]
  meta: Partial<IRoomPaginationMeta> & {
    limit?: number
  }
}

function normalizeMeta(
  meta: RawListEnvelope['meta'],
  fallbackPerPage: number,
): IRoomPaginationMeta {
  const perPage = meta.per_page ?? meta.limit ?? fallbackPerPage
  return {
    page: meta.page ?? 1,
    per_page: perPage,
    total: meta.total ?? 0,
    total_pages: meta.total_pages ?? 0,
  }
}

export async function getRooms(params: IRoomParams): Promise<IRoomListResult> {
  const cleaned = Object.fromEntries(
    Object.entries(params).filter(
      ([, value]) => value !== undefined && value !== null && value !== '',
    ),
  )
  const response = await apiClient.get<RawListEnvelope>('/rooms', {
    params: cleaned,
  })
  const envelope = response.data
  return {
    items: envelope.data,
    meta: normalizeMeta(envelope.meta, params.per_page ?? 10),
  }
}

export function getRoom(id: number) {
  return api.get<IRoom>(`/rooms/${id}`)
}

export function postRoom(payload: IRoomPayload) {
  return api.post<IRoom>('/rooms', payload)
}

export function putRoom(id: number, payload: IRoomPayload) {
  return api.put<IRoom>(`/rooms/${id}`, payload)
}

export function deleteRoom(id: number) {
  return api.delete<null>(`/rooms/${id}`)
}
