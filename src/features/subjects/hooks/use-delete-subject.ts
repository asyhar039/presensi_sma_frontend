import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { subjectKeys } from '@/features/subjects/lib/subject-query-options'
import { deleteSubject } from '@/features/subjects/services/subject-api'
import { getErrorMessage } from '@/utils/error'

export function useDeleteSubject() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteSubject,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: subjectKeys.lists(),
      })
      toast.success('Subject deleted successfully.')
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Failed to delete subject.'))
    },
  })
}
