import type { IStudentPasswordPayload } from '@/features/students/types/student.types'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { studentKeys } from '@/features/students/lib/student-query-options'
import { putStudentPassword } from '@/features/students/services/student-api'
import { getErrorMessage } from '@/utils/error'

export function useUpdateStudentPassword(id: number | null) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: IStudentPasswordPayload) =>
      putStudentPassword(id as number, payload),
    onSuccess: async () => {
      if (id) {
        await queryClient.invalidateQueries({
          queryKey: studentKeys.detail(id),
        })
      }
      toast.success('Student password updated successfully.')
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Failed to update student password.'))
    },
  })
}
