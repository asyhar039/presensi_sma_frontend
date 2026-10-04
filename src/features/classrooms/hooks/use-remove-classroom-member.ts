import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { classroomKeys } from '@/features/classrooms/lib/classroom-query-options'
import { deleteClassroomMember } from '@/features/classrooms/services/classroom-api'
import { getErrorMessage } from '@/utils/error'

export function useRemoveClassroomMember(classroomId: number) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (studentId: number) =>
      deleteClassroomMember(classroomId, studentId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: classroomKeys.lists() })
      await queryClient.invalidateQueries({
        queryKey: classroomKeys.detail(classroomId),
      })
      toast.success('Student removed from classroom successfully.')
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Failed to remove student.'))
    },
  })
}
