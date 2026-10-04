import type {
  IClassSchedule,
  IDraftRange,
  ISelectedSlot,
} from '@/features/schedules/types/schedule.types'
import type {
  IScheduleSlot,
  WeekDay,
} from '@/features/settings/types/schedule-clock.types'

import { IconCalendarOff, IconClock, IconLock } from '@tabler/icons-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import { Skeleton } from '@/components/ui/skeleton'
import { ScheduleDayGrid } from '@/features/schedules/components/schedule-day-grid'
import { WEEK_DAY_LABELS } from '@/features/settings/types/schedule-clock.types'

type ScheduleGridCardProps = {
  day: WeekDay
  classroomId: number | null
  slots: IScheduleSlot[]
  events: IClassSchedule[]
  isDayLoading: boolean
  isDayError: boolean
  isEventsLoading: boolean
  isEventsError: boolean
  onRetryDay: () => void
  onRetryEvents: () => void
  onEmptyClick: (draft: IDraftRange) => void
  onEventClick: (entry: IClassSchedule) => void
  onEventMove: (entry: IClassSchedule, draft: IDraftRange) => void
  onEventResize: (entry: IClassSchedule, draft: IDraftRange) => void
}

function GridSkeleton() {
  return (
    <div className="flex gap-3" aria-busy="true" aria-live="polite">
      <div className="flex w-20 flex-col gap-4 sm:w-28">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-4 w-full" />
        ))}
      </div>
      <div className="flex flex-1 flex-col gap-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-14 w-full" />
        ))}
      </div>
    </div>
  )
}

function GridError({ title, onRetry }: { title: string; onRetry: () => void }) {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <IconClock />
        </EmptyMedia>
        <EmptyTitle>{title}</EmptyTitle>
        <EmptyDescription>
          Check your connection and try again.
        </EmptyDescription>
      </EmptyHeader>
      <Button variant="outline" size="sm" onClick={onRetry}>
        Retry
      </Button>
    </Empty>
  )
}

function GridHoliday({ day }: { day: WeekDay }) {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <IconCalendarOff />
        </EmptyMedia>
        <EmptyTitle>Holiday</EmptyTitle>
        <EmptyDescription>
          No time slots configured for {WEEK_DAY_LABELS[day]}. Set day schedules
          in Settings.
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  )
}

function LockedOverlay({
  slots,
  day,
}: {
  slots: IScheduleSlot[]
  day: WeekDay
}) {
  const preview = slots.length > 0
  if (!preview) return <GridHoliday day={day} />
  return (
    <div
      className="pointer-events-none relative select-none"
      aria-disabled="true"
    >
      <div className="flex opacity-40">
        <div className="w-20 shrink-0 sm:w-28">
          {slots.map((slot, i) => (
            <div
              key={i}
              className="border-b py-2 pr-2 text-right text-[11px] tabular-nums text-muted-foreground"
            >
              {slot.start}
            </div>
          ))}
        </div>
        <div className="flex-1">
          {slots.map((slot, i) => (
            <div
              key={i}
              className="border-b px-3 py-2 text-xs text-muted-foreground"
            >
              {slot.is_break ? 'Break' : 'Period slot'} · {slot.start} –{' '}
              {slot.end}
            </div>
          ))}
        </div>
      </div>
      <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-background/60 p-4 backdrop-blur-[1px]">
        <div className="flex max-w-sm flex-col items-center gap-1 text-center">
          <IconLock className="size-5 text-muted-foreground" />
          <p className="text-sm font-medium">
            Select an academic year and class to load schedules.
          </p>
        </div>
      </div>
    </div>
  )
}

function GridBody(props: ScheduleGridCardProps) {
  if (props.isDayLoading) return <GridSkeleton />
  if (props.isDayError)
    return (
      <GridError title="Failed to load time range" onRetry={props.onRetryDay} />
    )
  if (!props.classroomId)
    return <LockedOverlay slots={props.slots} day={props.day} />
  if (props.slots.length === 0) return <GridHoliday day={props.day} />
  if (props.isEventsLoading) return <GridSkeleton />
  if (props.isEventsError)
    return (
      <GridError
        title="Failed to load class schedules"
        onRetry={props.onRetryEvents}
      />
    )
  return (
    <ScheduleDayGrid
      slots={props.slots}
      events={props.events}
      onEmptyClick={props.onEmptyClick}
      onEventClick={props.onEventClick}
      onEventMove={props.onEventMove}
      onEventResize={props.onEventResize}
    />
  )
}

export function ScheduleGridCard(props: ScheduleGridCardProps) {
  return (
    <Card>
      <CardHeader className="sr-only">
        <CardTitle>Daily schedule</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <GridBody {...props} />
      </CardContent>
    </Card>
  )
}

export type { ISelectedSlot }
