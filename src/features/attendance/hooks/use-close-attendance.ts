import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { attendanceKeys } from '@/features/attendance/lib/attendance-query-options'
import { postCloseAttendanceSession } from '@/features/attendance/services/attendance-api'
import { getErrorMessage } from '@/utils/error'

export function useCloseAttendance(id: number | null) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => postCloseAttendanceSession(id as number),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: attendanceKeys.lists(),
      })
      if (id) {
        await queryClient.invalidateQueries({
          queryKey: attendanceKeys.detail(id),
        })
      }
      toast.success('Attendance session closed successfully.')
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Failed to close attendance session.'))
    },
  })
}
