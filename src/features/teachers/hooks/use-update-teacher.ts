import type { ITeacherPayload } from '@/features/teachers/types/teacher.types'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { teacherKeys } from '@/features/teachers/lib/teacher-query-options'
import { putTeacher } from '@/features/teachers/services/teacher-api'
import { getErrorMessage } from '@/utils/error'

export function useUpdateTeacher(id: number | null) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: ITeacherPayload) => putTeacher(id as number, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: teacherKeys.lists(),
      })
      if (id) {
        await queryClient.invalidateQueries({
          queryKey: teacherKeys.detail(id),
        })
      }
      toast.success('Teacher updated successfully.')
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Failed to update teacher.'))
    },
  })
}
