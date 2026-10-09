import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { roomKeys } from '@/features/rooms/lib/room-query-options'
import { postRoom } from '@/features/rooms/services/room-api'
import { getErrorMessage } from '@/utils/error'

export function useCreateRoom() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: postRoom,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: roomKeys.lists(),
      })
      toast.success('Room created successfully.')
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Failed to create room.'))
    },
  })
}
