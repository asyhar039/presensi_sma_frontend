import type { IStudentPayload } from '@/features/students/types/student.types'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { studentKeys } from '@/features/students/lib/student-query-options'
import { putStudent } from '@/features/students/services/student-api'
import { getErrorMessage } from '@/utils/error'

export function useUpdateStudent(id: number | null) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: IStudentPayload) => putStudent(id as number, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: studentKeys.lists(),
      })
      if (id) {
        await queryClient.invalidateQueries({
          queryKey: studentKeys.detail(id),
        })
      }
      toast.success('Student updated successfully.')
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Failed to update student.'))
    },
  })
}
