import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { classroomKeys } from '@/features/classrooms/lib/classroom-query-options'
import { deleteClassroom } from '@/features/classrooms/services/classroom-api'
import { getErrorMessage } from '@/utils/error'

export function useDeleteClassroom() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteClassroom,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: classroomKeys.lists(),
      })
      toast.success('Classroom deleted successfully.')
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Failed to delete classroom.'))
    },
  })
}
