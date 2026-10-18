import type { IDutyAssignmentPayload } from '@/features/duty-teacher/assignments/types'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { dutyAssignmentKeys } from '@/features/duty-teacher/assignments/query'
import {
  deleteDutyAssignment,
  postDutyAssignment,
  putDutyAssignment,
} from '@/features/duty-teacher/assignments/services'
import { getErrorMessage } from '@/utils/error'

async function invalidate(queryClient: ReturnType<typeof useQueryClient>) {
  await queryClient.invalidateQueries({ queryKey: dutyAssignmentKeys.lists() })
}

export function useCreateDutyAssignment() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: postDutyAssignment,
    onSuccess: async () => {
      await invalidate(queryClient)
      toast.success('Duty teacher created successfully.')
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Failed to create duty teacher.'))
    },
  })
}

export function useUpdateDutyAssignment(id: number | null) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      id: targetId,
      payload,
    }: {
      id: number
      payload: Partial<IDutyAssignmentPayload>
    }) => putDutyAssignment(targetId, payload),
    onSuccess: async () => {
      await invalidate(queryClient)
      if (id) {
        await queryClient.invalidateQueries({
          queryKey: dutyAssignmentKeys.detail(id),
        })
      }
      toast.success('Duty teacher updated successfully.')
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Failed to update duty teacher.'))
    },
  })
}

export function useDeleteDutyAssignment() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteDutyAssignment,
    onSuccess: async () => {
      await invalidate(queryClient)
      toast.success('Duty teacher deleted successfully.')
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Failed to delete duty teacher.'))
    },
  })
}
