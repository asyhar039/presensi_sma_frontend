import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { settingsKeys } from '@/features/settings/lib/settings-query-options'
import { postPublicHoliday } from '@/features/settings/services/public-holiday.api'
import { getErrorMessage } from '@/utils/error'

export function useCreatePublicHoliday() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: postPublicHoliday,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: settingsKeys.holidays(),
      })
      toast.success('Public holiday created successfully.')
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Failed to create public holiday.'))
    },
  })
}
