import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { roomKeys } from '@/features/rooms/lib/room-query-options'
import { deleteRoom } from '@/features/rooms/services/room-api'
import { getErrorMessage } from '@/utils/error'

export function useDeleteRoom() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteRoom,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: roomKeys.lists(),
      })
      toast.success('Room deleted successfully.')
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Failed to delete room.'))
    },
  })
}
