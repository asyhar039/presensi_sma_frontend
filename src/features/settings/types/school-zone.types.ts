export type SchoolZonePoint = [number, number]

export interface ISchoolZone {
  id: number
  name: string
  points: SchoolZonePoint[]
  is_active: boolean
  created_at: string
  updated_at: string
}

export type SchoolZoneInput = Pick<ISchoolZone, 'name' | 'points' | 'is_active'>
export type SchoolZoneStatusFilter = 'all' | 'active' | 'inactive'
