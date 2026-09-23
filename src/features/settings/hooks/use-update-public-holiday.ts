import type { IUpdatePublicHolidayPayload } from '@/features/settings/types/public-holiday.types'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { settingsKeys } from '@/features/settings/lib/settings-query-options'
import { putPublicHoliday } from '@/features/settings/services/public-holiday.api'
import { getErrorMessage } from '@/utils/error'

interface UpdateVariables {
  id: number
  payload: IUpdatePublicHolidayPayload
}

export function useUpdatePublicHoliday() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, payload }: UpdateVariables) =>
      putPublicHoliday(id, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: settingsKeys.holidays(),
      })
      toast.success('Public holiday updated successfully.')
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Failed to update public holiday.'))
    },
  })
}
