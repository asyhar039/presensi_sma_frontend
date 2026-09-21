import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { attendanceKeys } from '@/features/attendance/lib/attendance-query-options'
import { postRejectAttendanceRequest } from '@/features/attendance/services/attendance-api'
import { getErrorMessage } from '@/utils/error'

export function useRejectAttendanceRequest(id: number | null) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => postRejectAttendanceRequest(id as number),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: attendanceKeys.lists(),
      })
      if (id) {
        await queryClient.invalidateQueries({
          queryKey: [...attendanceKeys.lists(), 'requests'],
        })
      }
      toast.success('Attendance request rejected successfully.')
    },
    onError: (error) => {
      toast.error(
        getErrorMessage(error, 'Failed to reject attendance request.'),
      )
    },
  })
}
