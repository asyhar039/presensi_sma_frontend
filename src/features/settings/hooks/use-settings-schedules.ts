import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import {
  daySchedulesQueryOptions,
  settingsKeys,
} from '@/features/settings/lib/settings-query-options'
import { putDaySchedule } from '@/features/settings/services/schedule-clock.api'
import { getErrorMessage } from '@/utils/error'

export function useDaySchedules() {
  return useQuery(daySchedulesQueryOptions())
}

export function useUpdateDaySchedule() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: putDaySchedule,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: settingsKeys.schedules(),
      })
      toast.success('Day schedule updated successfully.')
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Failed to update day schedule.'))
    },
  })
}
