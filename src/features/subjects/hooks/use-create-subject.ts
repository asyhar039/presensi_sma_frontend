import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { subjectKeys } from '@/features/subjects/lib/subject-query-options'
import { postSubject } from '@/features/subjects/services/subject-api'
import { getErrorMessage } from '@/utils/error'

export function useCreateSubject() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: postSubject,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: subjectKeys.lists(),
      })
      toast.success('Subject created successfully.')
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Failed to create subject.'))
    },
  })
}
