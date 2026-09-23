import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { studentKeys } from '@/features/students/lib/student-query-options'
import { deleteStudent } from '@/features/students/services/student-api'
import { getErrorMessage } from '@/utils/error'

export function useDeleteStudent() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteStudent,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: studentKeys.lists(),
      })
      toast.success('Student deleted successfully.')
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Failed to delete student.'))
    },
  })
}
