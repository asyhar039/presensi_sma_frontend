import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { attendanceKeys } from '@/features/attendance/lib/attendance-query-options'
import { postAttendanceSession } from '@/features/attendance/services/attendance-api'
import { getErrorMessage } from '@/utils/error'

export function useCreateAttendance() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: postAttendanceSession,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: attendanceKeys.lists(),
      })
      toast.success('Attendance session created successfully.')
    },
    onError: (error) => {
      toast.error(
        getErrorMessage(error, 'Failed to create attendance session.'),
      )
    },
  })
}
