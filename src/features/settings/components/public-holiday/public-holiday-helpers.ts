import type { Dayjs } from 'dayjs'
import type { IPublicHoliday } from '@/features/settings/types/public-holiday.types'

import dayjs from 'dayjs'

export const WEEKDAY_HEADER = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

export function toMonthParam(month: Dayjs): string {
  return month.format('MM-YYYY')
}

export function toTodayKey(): string {
  return dayjs().format('YYYY-MM-DD')
}

export function formatDisplayDate(date: string): string {
  return dayjs(date).format('DD MMMM YYYY')
}

export function formatMonthTitle(month: Dayjs): string {
  return month.format('MMMM YYYY')
}

export function formatMonthSummary(count: number): string {
  if (count === 0) {
    return 'No holidays this month.'
  }
  if (count === 1) {
    return '1 holiday this month.'
  }
  return `${count} holidays this month.`
}

export function formatListDescription(count: number): string {
  if (count === 0) {
    return 'No public holidays yet.'
  }
  if (count === 1) {
    return '1 holiday scheduled.'
  }
  return `${count} holidays scheduled.`
}

export function formatYearLabel(date: string): string {
  return dayjs(date).format('YYYY')
}

export function sortHolidaysByDate(
  holidays: IPublicHoliday[],
): IPublicHoliday[] {
  return [...holidays].sort((a, b) => a.date.localeCompare(b.date))
}

export function buildHolidaysByDate(
  holidays: IPublicHoliday[],
): Map<string, IPublicHoliday> {
  return new Map(holidays.map((holiday) => [holiday.date, holiday]))
}

export function getDayAriaLabel(
  dateKey: string,
  holiday: IPublicHoliday | undefined,
): string {
  if (holiday) {
    return `${dateKey}, ${holiday.name}`
  }
  return dateKey
}

export function getCellClassName(
  hasHoliday: boolean,
  isToday: boolean,
): string {
  if (hasHoliday && isToday) {
    return 'border-primary/40 bg-primary/5 ring-1 ring-primary hover:bg-primary/10'
  }
  if (hasHoliday) {
    return 'border-primary/40 bg-primary/5 hover:bg-primary/10'
  }
  if (isToday) {
    return 'border-border bg-card ring-1 ring-primary hover:bg-muted/60'
  }
  return 'border-border bg-card hover:bg-muted/60'
}

export function getDayNumberClassName(
  isToday: boolean,
  isWeekend: boolean,
): string {
  if (isToday) {
    return 'bg-primary font-semibold text-primary-foreground'
  }
  if (isWeekend) {
    return 'font-medium text-destructive'
  }
  return 'text-muted-foreground'
}

export function isWeekendDate(date: Dayjs): boolean {
  const day = date.day()
  return day === 0 || day === 6
}

export function getDialogTitle(mode: 'create' | 'edit'): string {
  if (mode === 'edit') {
    return 'Edit public holiday'
  }
  return 'Add public holiday'
}

export function getDialogDescription(mode: 'create' | 'edit'): string {
  if (mode === 'edit') {
    return 'Update the name or date of this public holiday.'
  }
  return 'Pick a date on the calendar or enter the details below.'
}

export function getSubmitLabel(mode: 'create' | 'edit'): string {
  if (mode === 'edit') {
    return 'Save changes'
  }
  return 'Add holiday'
}

export function getDialogFormKey(mode: 'create' | 'edit', key: string): string {
  return `${mode}-${key}`
}

export function findDuplicateDate(
  existing: IPublicHoliday[],
  date: string,
  excludeId?: number,
): boolean {
  return existing.some((item) => {
    if (item.date !== date) {
      return false
    }
    if (excludeId !== undefined && item.id === excludeId) {
      return false
    }
    return true
  })
}
