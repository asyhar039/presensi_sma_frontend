import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { teacherKeys } from '@/features/teachers/lib/teacher-query-options'
import { postTeacher } from '@/features/teachers/services/teacher-api'
import { getErrorMessage } from '@/utils/error'

export function useCreateTeacher() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: postTeacher,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: teacherKeys.lists(),
      })
      toast.success('Teacher created successfully.')
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Failed to create teacher.'))
    },
  })
}
