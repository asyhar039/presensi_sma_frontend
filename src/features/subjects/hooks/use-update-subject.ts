import type { ISubjectPayload } from '@/features/subjects/types/subject.types'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { subjectKeys } from '@/features/subjects/lib/subject-query-options'
import { putSubject } from '@/features/subjects/services/subject-api'
import { getErrorMessage } from '@/utils/error'

export function useUpdateSubject(id: number | null) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: ISubjectPayload) => putSubject(id as number, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: subjectKeys.lists(),
      })
      if (id) {
        await queryClient.invalidateQueries({
          queryKey: subjectKeys.detail(id),
        })
      }
      toast.success('Subject updated successfully.')
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Failed to update subject.'))
    },
  })
}
