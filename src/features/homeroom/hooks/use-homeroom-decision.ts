import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { homeroomKeys } from '@/features/homeroom/lib/homeroom-query-options'
import { decideHomeroomLeaveRequest } from '@/features/homeroom/services/homeroom-api'
import { getErrorMessage } from '@/utils/error'

export function useHomeroomDecision() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      decision,
      notes,
    }: {
      id: number
      decision: 'approved' | 'rejected'
      notes?: string
    }) => decideHomeroomLeaveRequest(id, { decision, notes }),
    onSuccess: async (_, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: homeroomKeys.lists() }),
        queryClient.invalidateQueries({
          queryKey: homeroomKeys.detail(variables.id),
        }),
      ])
      toast.success(
        variables.decision === 'approved'
          ? 'Leave request approved.'
          : 'Leave request rejected.',
      )
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Failed to decide leave request.'))
    },
  })
}
