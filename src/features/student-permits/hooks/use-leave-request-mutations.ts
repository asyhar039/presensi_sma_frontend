import type { ILeaveRequestResult } from '@/features/student-permits/types/permit.types'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { studentPermitKeys } from '@/features/student-permits/lib/student-permit-query-options'
import {
  postEarlyOut,
  postLateArrival,
  postSickLeave,
} from '@/features/student-permits/services/student-permit-api'
import { getErrorMessage } from '@/utils/error'

function useLeaveRequestMutation(
  mutationFn: (formData: FormData) => Promise<ILeaveRequestResult>,
  successMessage: string,
) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: studentPermitKeys.presence(),
      })
      toast.success(successMessage)
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Failed to submit leave request.'))
    },
  })
}

export function useSickLeaveMutation() {
  return useLeaveRequestMutation(postSickLeave, 'Sick leave request submitted.')
}

export function useEarlyOutMutation() {
  return useLeaveRequestMutation(postEarlyOut, 'Early leave request submitted.')
}

export function useLateArrivalMutation() {
  return useLeaveRequestMutation(
    postLateArrival,
    'Late arrival request submitted.',
  )
}
