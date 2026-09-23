import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { attendanceKeys } from '@/features/attendance/lib/attendance-query-options'
import { deleteAttendanceSession } from '@/features/attendance/services/attendance-api'
import { getErrorMessage } from '@/utils/error'

export function useDeleteAttendance(id: number | null) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => deleteAttendanceSession(id as number),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: attendanceKeys.lists(),
      })
      toast.success('Attendance session deleted successfully.')
    },
    onError: (error) => {
      toast.error(
        getErrorMessage(error, 'Failed to delete attendance session.'),
      )
    },
  })
}
