import type {
  IPublicHoliday,
  WeekdayKey,
  WeeklySchedule,
} from '@/features/student-permits/types/permit.types'

import dayjs from 'dayjs'

const WEEKDAYS: WeekdayKey[] = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
]

export function weekdayKeyOf(date: Date): WeekdayKey {
  return WEEKDAYS[(date.getDay() + 6) % 7]
}

export function toISODate(date: Date): string {
  return dayjs(date).format('YYYY-MM-DD')
}

// ponytail: local-timezone date math is the ceiling; upgrade to Temporal/ZonedDateTime when multi-timezone rollout lands.
export function countSchoolDays(
  dates: Date[],
  schedule: WeeklySchedule,
  holidays: IPublicHoliday[],
): number {
  const holidaySet = new Set(
    holidays.map((holiday) => holiday.date.slice(0, 10)),
  )
  return dates.filter((date) => {
    const key = toISODate(date)
    if (holidaySet.has(key)) return false
    return schedule[weekdayKeyOf(date)] !== null
  }).length
}

export function isSchoolDay(
  date: Date,
  schedule: WeeklySchedule,
  holidays: IPublicHoliday[],
): boolean {
  return countSchoolDays([date], schedule, holidays) === 1
}

export function isTimeWithin(
  time: string,
  start: string,
  end: string,
): boolean {
  return time >= start.slice(0, 5) && time <= end.slice(0, 5)
}
