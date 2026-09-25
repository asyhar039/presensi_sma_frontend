import type {
  SchoolZoneInput,
  SchoolZoneStatusFilter,
} from '@/features/settings/types/school-zone.types'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import {
  schoolZonesQueryOptions,
  settingsKeys,
} from '@/features/settings/lib/settings-query-options'
import {
  createSchoolZone,
  updateSchoolZone,
  updateSchoolZoneStatus,
} from '@/features/settings/services/school-zone.api'
import { getErrorMessage } from '@/utils/error'

export function useSchoolZones(filter: SchoolZoneStatusFilter = 'all') {
  return useQuery(schoolZonesQueryOptions(filter))
}

function useInvalidateSchoolZones() {
  const queryClient = useQueryClient()
  return () => queryClient.invalidateQueries({ queryKey: settingsKeys.zones() })
}

export function useCreateSchoolZone() {
  const invalidate = useInvalidateSchoolZones()
  return useMutation({
    mutationFn: createSchoolZone,
    onSuccess: async () => {
      await invalidate()
      toast.success('School zone created successfully.')
    },
    onError: (error) =>
      toast.error(getErrorMessage(error, 'Failed to create school zone.')),
  })
}

export function useUpdateSchoolZone() {
  const invalidate = useInvalidateSchoolZones()
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: SchoolZoneInput }) =>
      updateSchoolZone(id, payload),
    onSuccess: async () => {
      await invalidate()
      toast.success('School zone updated successfully.')
    },
    onError: (error) =>
      toast.error(getErrorMessage(error, 'Failed to update school zone.')),
  })
}

export function useUpdateSchoolZoneStatus() {
  const invalidate = useInvalidateSchoolZones()
  return useMutation({
    mutationFn: ({ id, isActive }: { id: number; isActive: boolean }) =>
      updateSchoolZoneStatus(id, isActive),
    onSuccess: async () => {
      await invalidate()
      toast.success('School zone status updated.')
    },
    onError: (error) =>
      toast.error(getErrorMessage(error, 'Failed to update zone status.')),
  })
}
