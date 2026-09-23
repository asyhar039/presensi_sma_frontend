import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import {
  publicHolidaysQueryOptions,
  settingsKeys,
} from '@/features/settings/lib/settings-query-options'
import {
  deletePublicHoliday,
  putPublicHolidays,
} from '@/features/settings/services/settings-api'
import { getErrorMessage } from '@/utils/error'

export function usePublicHolidays() {
  return useQuery(publicHolidaysQueryOptions())
}

export function useSavePublicHolidays() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: putPublicHolidays,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: settingsKeys.holidays(),
      })
      toast.success('Public holidays updated successfully.')
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Failed to save public holidays.'))
    },
  })
}

export function useDeletePublicHoliday() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deletePublicHoliday,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: settingsKeys.holidays(),
      })
      toast.success('Public holiday deleted successfully.')
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Failed to delete public holiday.'))
    },
  })
}
