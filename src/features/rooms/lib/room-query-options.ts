import type { IRoomParams } from '@/features/rooms/types/room.types'

import { keepPreviousData, queryOptions } from '@tanstack/react-query'

import { getRoom, getRooms } from '@/features/rooms/services/room-api'

export const roomKeys = {
  all: ['rooms'] as const,
  lists: () => [...roomKeys.all, 'list'] as const,
  list: (params: IRoomParams) => [...roomKeys.lists(), params] as const,
  details: () => [...roomKeys.all, 'detail'] as const,
  detail: (id: number) => [...roomKeys.details(), id] as const,
}

export function roomsQueryOptions(params: IRoomParams) {
  return queryOptions({
    queryKey: roomKeys.list(params),
    queryFn: () => getRooms(params),
    placeholderData: keepPreviousData,
    staleTime: 30_000,
  })
}

export function roomDetailQueryOptions(id: number | null) {
  return queryOptions({
    queryKey: roomKeys.detail(id ?? 0),
    queryFn: () => getRoom(id as number),
    enabled: typeof id === 'number' && Number.isFinite(id) && id > 0,
    staleTime: 30_000,
  })
}
