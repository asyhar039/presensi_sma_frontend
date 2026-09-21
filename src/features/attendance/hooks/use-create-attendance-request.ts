import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { attendanceKeys } from '@/features/attendance/lib/attendance-query-options'
import { postAttendanceRequest } from '@/features/attendance/services/attendance-api'
import { getErrorMessage } from '@/utils/error'

export function useCreateAttendanceRequest() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: postAttendanceRequest,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: attendanceKeys.lists(),
      })
      toast.success('Attendance request created successfully.')
    },
    onError: (error) => {
      toast.error(
        getErrorMessage(error, 'Failed to create attendance request.'),
      )
    },
  })
}
