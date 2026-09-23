import type { IClassroomPayload } from '@/features/classrooms/types/classroom.types'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { classroomKeys } from '@/features/classrooms/lib/classroom-query-options'
import { putClassroom } from '@/features/classrooms/services/classroom-api'
import { getErrorMessage } from '@/utils/error'

export function useUpdateClassroom(id: number | null) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: IClassroomPayload) =>
      putClassroom(id as number, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: classroomKeys.lists(),
      })
      if (id) {
        await queryClient.invalidateQueries({
          queryKey: classroomKeys.detail(id),
        })
      }
      toast.success('Classroom updated successfully.')
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Failed to update classroom.'))
    },
  })
}
