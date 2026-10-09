import { useQuery } from '@tanstack/react-query'

import { roomDetailQueryOptions } from '@/features/rooms/lib/room-query-options'

export function useRoomDetail(id: number | null, enabled = true) {
  const options = roomDetailQueryOptions(id)
  return useQuery({ ...options, enabled: options.enabled && enabled })
}
