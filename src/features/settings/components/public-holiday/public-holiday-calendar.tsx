import type { Dayjs } from 'dayjs'
import type { IPublicHoliday } from '@/features/settings/types/public-holiday.types'

import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react'
import dayjs from 'dayjs'
import { useMemo } from 'react'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Spinner } from '@/components/ui/spinner'
import {
  WEEKDAY_HEADER,
  formatMonthSummary,
  formatMonthTitle,
  getCellClassName,
  getDayAriaLabel,
  getDayNumberClassName,
  isWeekendDate,
} from '@/features/settings/components/public-holiday/public-holiday-helpers'
import { cn } from '@/lib/class-name'

export interface IPublicHolidayCalendarProps {
  month: Dayjs
  holidaysByDate: Map<string, IPublicHoliday>
  monthHolidayCount: number
  isLoading?: boolean
  onMonthChange: (month: Dayjs) => void
  onPickDate: (date: string, existing: IPublicHoliday | undefined) => void
}

export function PublicHolidayCalendar({
  month,
  holidaysByDate,
  monthHolidayCount,
  isLoading = false,
  onMonthChange,
  onPickDate,
}: IPublicHolidayCalendarProps) {
  const cells = useMemo(() => {
    const startOfMonth = month.startOf('month')
    const leading = (startOfMonth.day() + 6) % 7
    const daysInMonth = month.daysInMonth()
    return [
      ...Array.from({ length: leading }, () => null),
      ...Array.from({ length: daysInMonth }, (_, index) =>
        startOfMonth.add(index, 'day'),
      ),
    ]
  }, [month])

  const handlePreviousMonth = () => {
    onMonthChange(month.subtract(1, 'month'))
  }

  const handleNextMonth = () => {
    onMonthChange(month.add(1, 'month'))
  }

  const handleToday = () => {
    onMonthChange(dayjs())
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <CardTitle className="truncate">
              {formatMonthTitle(month)}
            </CardTitle>
            <CardDescription>
              {formatMonthSummary(monthHolidayCount)}
            </CardDescription>
          </div>
          <div className="flex items-center gap-1">
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              aria-label="Previous month"
              onClick={handlePreviousMonth}
            >
              <IconChevronLeft className="size-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleToday}
            >
              Today
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              aria-label="Next month"
              onClick={handleNextMonth}
            >
              <IconChevronRight className="size-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="relative flex flex-col gap-2 sm:gap-3">
        <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-medium text-muted-foreground sm:text-xs">
          {WEEKDAY_HEADER.map((day) => (
            <div key={day} className="py-1">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1 sm:gap-1.5">
          {cells.map((date, index) => {
            if (!date) {
              return (
                <div
                  key={`empty-${index}`}
                  className="min-h-14 sm:min-h-16 lg:min-h-20"
                />
              )
            }
            const key = date.format('YYYY-MM-DD')
            const holiday = holidaysByDate.get(key)
            const hasHoliday = holiday !== undefined
            const isToday = date.isSame(dayjs(), 'day')
            const isWeekend = isWeekendDate(date)
            return (
              <Button
                key={key}
                type="button"
                variant="ghost"
                onClick={() => onPickDate(key, holiday)}
                aria-label={getDayAriaLabel(key, holiday)}
                title={holiday ? `${key} — ${holiday.name}` : key}
                className={cn(
                  'h-auto min-h-14 flex-col items-start justify-start gap-1 overflow-hidden rounded-lg border p-1.5 text-left font-normal sm:min-h-16 sm:p-2 lg:min-h-20',
                  getCellClassName(hasHoliday, isToday),
                )}
              >
                <span
                  className={cn(
                    'flex size-5 items-center justify-center rounded-full text-[11px] sm:size-6 sm:text-xs',
                    getDayNumberClassName(isToday, isWeekend),
                  )}
                >
                  {date.date()}
                </span>
                {hasHoliday && (
                  <span className="block w-full truncate text-[10px] leading-tight font-medium sm:text-[11px]">
                    {holiday.name}
                  </span>
                )}
              </Button>
            )
          })}
        </div>
        {isLoading && (
          <div
            aria-hidden={!isLoading}
            className="absolute inset-0 z-10 flex items-center justify-center gap-2 bg-background/60 backdrop-blur-[1px]"
          >
            <span className="flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground shadow-sm">
              <Spinner className="size-3.5" />
              Loading...
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
