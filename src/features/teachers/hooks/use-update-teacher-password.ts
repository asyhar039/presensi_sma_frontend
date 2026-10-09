import type { ITeacherPasswordPayload } from '@/features/teachers/types/teacher.types'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { teacherKeys } from '@/features/teachers/lib/teacher-query-options'
import { putTeacherPassword } from '@/features/teachers/services/teacher-api'
import { getErrorMessage } from '@/utils/error'

export function useUpdateTeacherPassword(id: number | null) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: ITeacherPasswordPayload) =>
      putTeacherPassword(id as number, payload),
    onSuccess: async () => {
      if (id) {
        await queryClient.invalidateQueries({
          queryKey: teacherKeys.detail(id),
        })
      }
      toast.success('Teacher password updated successfully.')
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Failed to update teacher password.'))
    },
  })
}
