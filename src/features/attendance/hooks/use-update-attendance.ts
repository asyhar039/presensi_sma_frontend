import type { IAttendanceSessionPayload } from '@/features/attendance/types/attendance.types'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { attendanceKeys } from '@/features/attendance/lib/attendance-query-options'
import { putAttendanceSession } from '@/features/attendance/services/attendance-api'
import { getErrorMessage } from '@/utils/error'

export function useUpdateAttendance(id: number | null) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: IAttendanceSessionPayload) =>
      putAttendanceSession(id as number, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: attendanceKeys.lists(),
      })
      if (id) {
        await queryClient.invalidateQueries({
          queryKey: attendanceKeys.detail(id),
        })
      }
      toast.success('Attendance session updated successfully.')
    },
    onError: (error) => {
      toast.error(
        getErrorMessage(error, 'Failed to update attendance session.'),
      )
    },
  })
}
