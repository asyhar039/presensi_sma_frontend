import type {
  ITeacherCalendarDay,
  ITeacherDayStatus,
} from '@/features/teacher-attendance/types/teacher-attendance.types'

import { useMemo, useState } from 'react'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { cn } from '@/lib/class-name'

type TeacherCalendarProps = {
  month: string
  calendar: ITeacherCalendarDay[]
}

type DayEntry = {
  key: string
  date: Date | null
  entry: ITeacherCalendarDay | null
}

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

const STATUS_TONE: Record<ITeacherDayStatus, string> = {
  present: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400',
  sick_leave: 'bg-amber-500/10 text-amber-700 dark:text-amber-400',
  permit: 'bg-sky-500/10 text-sky-700 dark:text-sky-400',
  alpha: 'bg-destructive/10 text-destructive',
  upcoming: 'bg-muted text-muted-foreground',
}

const STATUS_LABEL: Record<ITeacherDayStatus, string> = {
  present: 'Present',
  sick_leave: 'Sick',
  permit: 'Permit',
  alpha: 'Absent',
  upcoming: 'Upcoming',
}

function dayStatus(
  entry: ITeacherCalendarDay,
): ITeacherDayStatus | 'holiday' | 'none' {
  if (entry.is_holiday) return 'holiday'
  if (entry.schedules.length === 0) return 'none'
  const first = entry.schedules.find((s) => s.status !== 'upcoming')
  return (first ?? entry.schedules[0]).status
}

function buildCells(calendar: ITeacherCalendarDay[]): DayEntry[] {
  if (calendar.length === 0) return []
  const first = new Date(`${calendar[0].date}T00:00:00`)
  const offset = (first.getDay() + 6) % 7
  const cells: DayEntry[] = Array.from({ length: offset }, (_, i) => ({
    key: `pad-${i}`,
    date: null,
    entry: null,
  }))
  for (const entry of calendar) {
    cells.push({
      key: entry.date,
      date: new Date(`${entry.date}T00:00:00`),
      entry,
    })
  }
  return cells
}

type DayDialogProps = {
  entry: ITeacherCalendarDay | null
  onClose: () => void
}

function DayDialog({ entry, onClose }: DayDialogProps) {
  return (
    <Dialog open={entry !== null} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {entry ? `Schedule on ${entry.date}` : 'Schedule'}
          </DialogTitle>
        </DialogHeader>
        {entry && (
          <div className="flex flex-col gap-3">
            {entry.schedules.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No class schedule on this day.
              </p>
            ) : (
              entry.schedules.map((schedule) => (
                <div
                  key={schedule.schedule_id}
                  className="flex flex-col gap-1 rounded-lg border p-3"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-medium">
                      {schedule.start_time} - {schedule.end_time}
                    </span>
                    <Badge
                      variant="secondary"
                      className={cn(STATUS_TONE[schedule.status])}
                    >
                      {STATUS_LABEL[schedule.status]}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {schedule.teacher}
                  </p>
                  {schedule.permit_types.length > 0 && (
                    <p className="text-xs text-muted-foreground">
                      Permit: {schedule.permit_types.join(', ')}
                    </p>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

export function TeacherCalendar({ month, calendar }: TeacherCalendarProps) {
  const [selected, setSelected] = useState<ITeacherCalendarDay | null>(null)
  const cells = useMemo(() => buildCells(calendar), [calendar])
  const [year, monthNum] = month.split('-').map(Number)
  const title = new Date(year, monthNum - 1, 1).toLocaleString('en-US', {
    month: 'long',
    year: 'numeric',
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
          {WEEKDAYS.map((day) => (
            <p
              key={day}
              className="pb-1 text-center text-xs font-medium text-muted-foreground"
            >
              {day}
            </p>
          ))}
          {cells.map((cell) => {
            if (!cell.entry || !cell.date) {
              return <span key={cell.key} className="min-h-16 sm:min-h-24" />
            }
            const status = dayStatus(cell.entry)
            const hasSchedule = cell.entry.schedules.length > 0
            return (
              <button
                key={cell.key}
                type="button"
                disabled={!hasSchedule}
                onClick={() => hasSchedule && setSelected(cell.entry)}
                className={cn(
                  'flex min-h-16 flex-col items-start gap-1 rounded-lg border p-1.5 text-left transition-colors sm:min-h-24 sm:p-2',
                  hasSchedule && 'cursor-pointer hover:border-primary/50',
                  !hasSchedule && 'cursor-default border-dashed',
                  status === 'holiday' && 'border-dashed bg-muted/50',
                  status === 'present' && 'border-emerald-500/30',
                  status === 'alpha' && 'border-destructive/30',
                  status === 'sick_leave' && 'border-amber-500/30',
                  status === 'permit' && 'border-sky-500/30',
                )}
              >
                <span className="text-xs font-semibold tabular-nums sm:text-sm">
                  {cell.date.getDate()}
                </span>
                {status === 'holiday' ? (
                  <span className="text-[10px] text-muted-foreground">
                    Holiday
                  </span>
                ) : hasSchedule ? (
                  <span className="flex flex-wrap gap-1">
                    {cell.entry.schedules.slice(0, 2).map((schedule) => (
                      <Badge
                        key={schedule.schedule_id}
                        variant="secondary"
                        className={cn(
                          'px-1 py-0 text-[10px]',
                          STATUS_TONE[schedule.status],
                        )}
                      >
                        {STATUS_LABEL[schedule.status]}
                      </Badge>
                    ))}
                  </span>
                ) : (
                  <span className="text-[10px] text-muted-foreground">-</span>
                )}
              </button>
            )
          })}
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {(Object.entries(STATUS_LABEL) as [ITeacherDayStatus, string][]).map(
            ([status, label]) => (
              <span
                key={status}
                className={cn(
                  'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium',
                  STATUS_TONE[status],
                )}
              >
                {label}
              </span>
            ),
          )}
        </div>
        <DayDialog entry={selected} onClose={() => setSelected(null)} />
      </CardContent>
    </Card>
  )
}
// ponytail: month nav buttons own data-fetch state in view; add when multi-month browsing needed.
