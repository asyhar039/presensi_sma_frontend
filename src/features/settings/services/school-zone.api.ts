import type {
  ISchoolZone,
  SchoolZoneInput,
  SchoolZoneStatusFilter,
} from '@/features/settings/types/school-zone.types'

import { api } from '@/services/api-client'

export function getSchoolZones(filter: SchoolZoneStatusFilter = 'all') {
  return api.get<ISchoolZone[]>('/settings/school-zones', {
    params:
      filter === 'all' ? undefined : { is_active: filter === 'active' ? 1 : 0 },
  })
}

export function createSchoolZone(payload: SchoolZoneInput) {
  return api.post<ISchoolZone>('/settings/school-zones', payload)
}

export function updateSchoolZone(
  id: number,
  payload: Partial<SchoolZoneInput>,
) {
  return api.put<ISchoolZone>(`/settings/school-zones/${id}`, payload)
}

export function updateSchoolZoneStatus(id: number, isActive: boolean) {
  return api.patch<ISchoolZone>(`/settings/school-zones/${id}/active`, {
    is_active: isActive,
  })
}
