export const WEEK_DAYS = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
] as const

export type WeekDay = (typeof WEEK_DAYS)[number]

export const WEEK_DAY_LABELS: Record<WeekDay, string> = {
  monday: 'Monday',
  tuesday: 'Tuesday',
  wednesday: 'Wednesday',
  thursday: 'Thursday',
  friday: 'Friday',
  saturday: 'Saturday',
  sunday: 'Sunday',
}

export function isWeekDay(value: string): value is WeekDay {
  return (WEEK_DAYS as readonly string[]).includes(value)
}

export interface IScheduleSlot {
  start: string
  end: string
  is_break: boolean
}

export interface IDaySchedule {
  day: string
  schedules: IScheduleSlot[]
}

export interface IUpdateDaySchedulePayload {
  day: string
  schedules: IScheduleSlot[]
}

export interface IPublicHoliday {
  name: string
  date: string
}

export type SchoolZonePoint = [number, number]

export interface ISchoolZone {
  name: string
  points: SchoolZonePoint[]
}
