import type { IRoomPayload } from '@/features/rooms/types/room.types'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { roomKeys } from '@/features/rooms/lib/room-query-options'
import { putRoom } from '@/features/rooms/services/room-api'
import { getErrorMessage } from '@/utils/error'

export function useUpdateRoom(id: number | null) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: IRoomPayload) => putRoom(id as number, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: roomKeys.lists(),
      })
      if (id) {
        await queryClient.invalidateQueries({
          queryKey: roomKeys.detail(id),
        })
      }
      toast.success('Room updated successfully.')
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Failed to update room.'))
    },
  })
}
