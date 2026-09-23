import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import {
  schoolZonesQueryOptions,
  settingsKeys,
} from '@/features/settings/lib/settings-query-options'
import {
  deleteSchoolZone,
  putSchoolZones,
} from '@/features/settings/services/school-zone.api'
import { getErrorMessage } from '@/utils/error'

export function useSchoolZones() {
  return useQuery(schoolZonesQueryOptions())
}

export function useSaveSchoolZones() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: putSchoolZones,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: settingsKeys.zones(),
      })
      toast.success('School zones updated successfully.')
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Failed to save school zones.'))
    },
  })
}

export function useDeleteSchoolZone() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteSchoolZone,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: settingsKeys.zones(),
      })
      toast.success('School zone deleted successfully.')
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Failed to delete school zone.'))
    },
  })
}
