import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import {
  classSchedulesQueryOptions,
  scheduleKeys,
} from '@/features/schedules/lib/schedule-query-options'
import {
  deleteClassSchedule,
  postClassSchedule,
  putClassSchedule,
} from '@/features/schedules/services/schedule-api'
import { getErrorMessage } from '@/utils/error'

export function useClassSchedules(classroomId: number | null, day: string) {
  return useQuery(classSchedulesQueryOptions(classroomId, day))
}

function invalidate(client: ReturnType<typeof useQueryClient>) {
  client.invalidateQueries({ queryKey: scheduleKeys.all })
}

export function useCreateClassSchedule() {
  const client = useQueryClient()
  return useMutation({
    mutationFn: postClassSchedule,
    onSuccess: async () => {
      await client.invalidateQueries({ queryKey: scheduleKeys.all })
      toast.success('Class schedule created successfully.')
    },
    onError: (e) =>
      toast.error(getErrorMessage(e, 'Failed to create schedule.')),
  })
}

export function useUpdateClassSchedule() {
  const client = useQueryClient()
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number
      payload: Parameters<typeof putClassSchedule>[1]
    }) => putClassSchedule(id, payload),
    onSuccess: async () => {
      await client.invalidateQueries({ queryKey: scheduleKeys.all })
      toast.success('Class schedule updated successfully.')
    },
    onError: (e) =>
      toast.error(getErrorMessage(e, 'Failed to update schedule.')),
  })
}

export function useDeleteClassSchedule() {
  const client = useQueryClient()
  return useMutation({
    mutationFn: deleteClassSchedule,
    onSuccess: async () => {
      await client.invalidateQueries({ queryKey: scheduleKeys.all })
      toast.success('Class schedule deleted successfully.')
    },
    onError: (e) =>
      toast.error(getErrorMessage(e, 'Failed to delete schedule.')),
  })
}

export { invalidate }
