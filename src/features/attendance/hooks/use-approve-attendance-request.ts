import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { attendanceKeys } from '@/features/attendance/lib/attendance-query-options'
import { postApproveAttendanceRequest } from '@/features/attendance/services/attendance-api'
import { getErrorMessage } from '@/utils/error'

export function useApproveAttendanceRequest(id: number | null) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => postApproveAttendanceRequest(id as number),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: attendanceKeys.lists(),
      })
      if (id) {
        await queryClient.invalidateQueries({
          queryKey: [...attendanceKeys.lists(), 'requests'],
        })
      }
      toast.success('Attendance request approved successfully.')
    },
    onError: (error) => {
      toast.error(
        getErrorMessage(error, 'Failed to approve attendance request.'),
      )
    },
  })
}
