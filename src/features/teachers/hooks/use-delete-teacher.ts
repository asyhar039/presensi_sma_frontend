import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { teacherKeys } from '@/features/teachers/lib/teacher-query-options'
import { deleteTeacher } from '@/features/teachers/services/teacher-api'
import { getErrorMessage } from '@/utils/error'

export function useDeleteTeacher() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteTeacher,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: teacherKeys.lists(),
      })
      toast.success('Teacher deleted successfully.')
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Failed to delete teacher.'))
    },
  })
}
