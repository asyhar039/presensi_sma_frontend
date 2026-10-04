import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { classroomKeys } from '@/features/classrooms/lib/classroom-query-options'
import { postClassroomMembers } from '@/features/classrooms/services/classroom-api'
import { getErrorMessage } from '@/utils/error'

export function useAssignClassroomMembers(id: number) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (studentIds: number[]) => postClassroomMembers(id, studentIds),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: classroomKeys.lists() })
      await queryClient.invalidateQueries({
        queryKey: classroomKeys.detail(id),
      })
      toast.success('Students assigned to classroom successfully.')
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Failed to assign students.'))
    },
  })
}
