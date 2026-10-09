import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { studentKeys } from '@/features/students/lib/student-query-options'
import { postStudent } from '@/features/students/services/student-api'
import { getErrorMessage } from '@/utils/error'

export function useCreateStudent() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: postStudent,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: studentKeys.lists(),
      })
      toast.success('Student created successfully.')
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Failed to create student.'))
    },
  })
}
