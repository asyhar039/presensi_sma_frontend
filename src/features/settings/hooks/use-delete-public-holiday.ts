import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { settingsKeys } from '@/features/settings/lib/settings-query-options'
import { deletePublicHoliday } from '@/features/settings/services/public-holiday.api'
import { getErrorMessage } from '@/utils/error'

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
