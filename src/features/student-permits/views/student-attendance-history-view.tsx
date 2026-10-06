import type { ICalendarDay } from '@/features/student-permits/services/presence-scan-api'

import {
  IconArrowLeft,
  IconCalendarMonth,
  IconChevronLeft,
  IconChevronRight,
} from '@tabler/icons-react'
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import dayjs from 'dayjs'
import { useMemo, useState } from 'react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import { Skeleton } from '@/components/ui/skeleton'
import {
  monthlyCalendarQueryOptions,
  studentInformationQueryOptions,
} from '@/features/student-permits/lib/attendance-history-query-options'
import { cn } from '@/lib/class-name'
import { getErrorMessage } from '@/utils/error'

type HistoryViewProps = { month?: string }

const STATUS_TONE: Record<string, string> = {
  present:
    'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  sick_leave:
    'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  permit:
    'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  alpha: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  holiday: 'bg-muted text-muted-foreground',
  upcoming: 'bg-muted text-muted-foreground',
}

function statusTone(status: string) {
  return STATUS_TONE[status.toLowerCase()] ?? 'bg-muted text-muted-foreground'
}

function DayCell({
  day,
  selected,
  onSelect,
}: {
  day: ICalendarDay
  selected: boolean
  onSelect: () => void
}) {
  const d = dayjs(day.date)
  const primary =
    day.schedules[0]?.status.toLowerCase() ??
    (day.is_holiday === 'true' || day.is_holiday === '1'
      ? 'holiday'
      : 'upcoming')
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        'flex min-h-16 flex-col items-start gap-1 rounded-lg border p-2 text-left transition-colors hover:bg-muted/60 md:min-h-20',
        selected && 'border-primary ring-1 ring-primary',
      )}
    >
      <span className="text-xs font-semibold">{d.format('D')}</span>
      <span
        className={cn(
          'rounded px-1.5 py-0.5 text-[10px] font-medium capitalize',
          statusTone(primary),
        )}
      >
        {day.is_holiday === 'true' || day.is_holiday === '1'
          ? 'Holiday'
          : primary.replaceAll('_', ' ')}
      </span>
      {day.schedules.length > 1 && (
        <span className="text-[10px] text-muted-foreground">
          +{day.schedules.length - 1} more
        </span>
      )}
    </button>
  )
}

function DayCellSkeleton() {
  return <Skeleton className="min-h-16 w-full md:min-h-20" />
}

function DetailPanel({ day }: { day: ICalendarDay | null }) {
  if (!day) {
    return (
      <Empty className="border">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <IconCalendarMonth />
          </EmptyMedia>
          <EmptyTitle>Select a date</EmptyTitle>
          <EmptyDescription>
            Tap a calendar day to see that day&apos;s schedule and status.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    )
  }
  return (
    <div className="space-y-3">
      <div>
        <p className="font-semibold">
          {dayjs(day.date).format('dddd, DD MMMM YYYY')}
        </p>
        <p className="text-xs text-muted-foreground">
          {day.schedules.length} schedule{day.schedules.length === 1 ? '' : 's'}
        </p>
      </div>
      {day.schedules.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No schedules on this day.
        </p>
      ) : (
        <ul className="space-y-2">
          {day.schedules.map((s) => (
            <li key={s.schedule_id} className="rounded-lg border p-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm font-medium">
                  {s.start_time}–{s.end_time}
                </p>
                <Badge className={cn('capitalize', statusTone(s.status))}>
                  {s.status.replaceAll('_', ' ')}
                </Badge>
              </div>
              <p className="mt-1 text-sm">{s.teacher}</p>
              <p className="text-xs capitalize text-muted-foreground">
                {s.day}
              </p>
              {s.permit_types.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {s.permit_types.map((t) => (
                    <Badge
                      key={t}
                      variant="outline"
                      className="text-[10px] capitalize"
                    >
                      {t.replaceAll('_', ' ')}
                    </Badge>
                  ))}
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export function StudentAttendanceHistoryView({
  month: initialMonth,
}: HistoryViewProps = {}) {
  const navigate = useNavigate()
  const [cursor, setCursor] = useState(
    () => initialMonth ?? dayjs().format('YYYY-MM'),
  )
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const monthParam = useMemo(
    () => dayjs(`${cursor}-01`).format('YYYY-MM'),
    [cursor],
  )

  const infoQuery = useQuery(studentInformationQueryOptions())
  const calendarQuery = useQuery(monthlyCalendarQueryOptions(monthParam))
  const days = calendarQuery.data?.days ?? []
  const selected: ICalendarDay | null = useMemo(
    () =>
      days.find((d) => d.date === selectedDate) ??
      days.find((d) => d.date === dayjs().format('YYYY-MM-DD')) ??
      null,
    [days, selectedDate],
  )
  const leadingBlanks = useMemo(() => {
    if (days.length === 0) return 0
    return (dayjs(days[0].date).day() + 6) % 7
  }, [days])

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6 px-4 py-6 sm:px-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Attendance History
          </h1>
          <p className="text-sm text-muted-foreground">
            Per-day schedule entries with your presence status.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            aria-label="Previous month"
            onClick={() =>
              setCursor((c) =>
                dayjs(`${c}-01`).subtract(1, 'month').format('YYYY-MM'),
              )
            }
          >
            <IconChevronLeft />
          </Button>
          <span className="min-w-32 text-center text-sm font-medium">
            {dayjs(`${monthParam}-01`).format('MMMM YYYY')}
          </span>
          <Button
            variant="outline"
            size="icon"
            aria-label="Next month"
            onClick={() =>
              setCursor((c) =>
                dayjs(`${c}-01`).add(1, 'month').format('YYYY-MM'),
              )
            }
          >
            <IconChevronRight />
          </Button>
          <Button
            variant="ghost"
            onClick={() => navigate({ to: '/dashboard' })}
          >
            <IconArrowLeft />
            Back
          </Button>
        </div>
      </div>

      {infoQuery.isPending ? (
        <Skeleton className="h-20 w-full" />
      ) : infoQuery.data ? (
        <Card>
          <CardContent className="grid grid-cols-2 gap-3 p-4 sm:grid-cols-4">
            <div>
              <p className="text-xs text-muted-foreground">Class</p>
              <p className="text-sm font-medium">{infoQuery.data.class.name}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Homeroom teacher</p>
              <p className="text-sm font-medium">
                {infoQuery.data.class.homeroom_teacher.name}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Academic year</p>
              <p className="text-sm font-medium">
                {dayjs(infoQuery.data.academic_year.odd_start_date).format(
                  'YYYY',
                )}
                /
                {dayjs(infoQuery.data.academic_year.even_end_date).format(
                  'YYYY',
                )}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Month</p>
              <p className="text-sm font-medium">
                {calendarQuery.data?.month ?? monthParam}
              </p>
            </div>
          </CardContent>
        </Card>
      ) : null}

      <div className="grid items-start gap-6 lg:grid-cols-12">
        <Card className="lg:col-span-8">
          <CardHeader>
            <CardTitle>Monthly calendar</CardTitle>
            <CardDescription>
              Present, sick leave, permit, alpha, or holiday per day.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-2 grid grid-cols-7 gap-1.5 text-center text-[11px] font-medium text-muted-foreground md:gap-2">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) => (
                <span key={d}>{d}</span>
              ))}
            </div>
            {calendarQuery.isPending ? (
              <div className="grid grid-cols-7 gap-1.5 md:gap-2">
                {Array.from({ length: 35 }).map((_, i) => (
                  <DayCellSkeleton key={i} />
                ))}
              </div>
            ) : calendarQuery.isError ? (
              <Empty className="border">
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <IconCalendarMonth />
                  </EmptyMedia>
                  <EmptyTitle>Failed to load history</EmptyTitle>
                  <EmptyDescription>
                    {getErrorMessage(calendarQuery.error)}
                  </EmptyDescription>
                </EmptyHeader>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => calendarQuery.refetch()}
                >
                  Try again
                </Button>
              </Empty>
            ) : days.length === 0 ? (
              <Empty className="border">
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <IconCalendarMonth />
                  </EmptyMedia>
                  <EmptyTitle>No data this month</EmptyTitle>
                  <EmptyDescription>
                    There are no schedule entries for{' '}
                    {dayjs(`${monthParam}-01`).format('MMMM YYYY')}.
                  </EmptyDescription>
                </EmptyHeader>
              </Empty>
            ) : (
              <div className="grid grid-cols-7 gap-1.5 md:gap-2">
                {Array.from({ length: leadingBlanks }).map((_, i) => (
                  <span key={`blank-${i}`} />
                ))}
                {days.map((day) => (
                  <DayCell
                    key={day.date}
                    day={day}
                    selected={selected?.date === day.date}
                    onSelect={() => setSelectedDate(day.date)}
                  />
                ))}
              </div>
            )}
            <div className="mt-4 flex flex-wrap gap-1.5">
              {[
                'present',
                'sick_leave',
                'permit',
                'alpha',
                'holiday',
                'upcoming',
              ].map((s) => (
                <Badge key={s} className={cn('capitalize', statusTone(s))}>
                  {s.replaceAll('_', ' ')}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Day detail</CardTitle>
            <CardDescription>
              {selected
                ? dayjs(selected.date).format('DD MMMM YYYY')
                : 'Nothing selected'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {calendarQuery.isPending ? (
              <div className="space-y-2">
                <Skeleton className="h-6 w-2/3" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
              </div>
            ) : (
              <DetailPanel day={selected} />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
