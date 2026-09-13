import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { classroomKeys } from '@/features/classrooms/lib/classroom-query-options'
import { postClassroom } from '@/features/classrooms/services/classroom-api'
import { getErrorMessage } from '@/utils/error'

export function useCreateClassroom() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: postClassroom,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: classroomKeys.lists(),
      })
      toast.success('Classroom created successfully.')
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Failed to create classroom.'))
    },
  })
}
