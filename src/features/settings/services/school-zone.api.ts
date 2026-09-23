import type { ISchoolZone } from '@/features/settings/types/school-zone.types'

import { api } from '@/services/api-client'

export function getSchoolZones() {
  return api.get<ISchoolZone[]>('/settings/school-zones')
}

export function putSchoolZones(payload: ISchoolZone[]) {
  return api.put<ISchoolZone[]>('/settings/school-zones', payload)
}

export function deleteSchoolZone(name: string) {
  return api.delete<null>(`/settings/school-zones/${encodeURIComponent(name)}`)
}
