import type { WeekDay } from '@/features/settings/types/schedule-clock.types'

import {
  IconCalendarOff,
  IconClock,
  IconRotateClockwise,
} from '@tabler/icons-react'
import { useMemo, useState } from 'react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import { Skeleton } from '@/components/ui/skeleton'
import { TeacherScheduleGrid } from '@/features/schedules/components/teacher-schedule-grid'
import { useMyTeachingSchedules } from '@/features/schedules/hooks/use-my-teaching-schedules'
import { useDaySchedules } from '@/features/settings/hooks/use-settings-schedules'
import {
  WEEK_DAYS,
  WEEK_DAY_LABELS,
} from '@/features/settings/types/schedule-clock.types'
import { cn } from '@/lib/class-name'

export function TeacherScheduleView() {
  const [day, setDay] = useState<WeekDay>('monday')
  const dayQuery = useDaySchedules()
  const weekQuery = useMyTeachingSchedules()
  const events = weekQuery.data?.[day] ?? []

  const slots = useMemo(
    () => dayQuery.data?.find((item) => item.day === day)?.schedules ?? [],
    [dayQuery.data, day],
  )
  const slotCount = useMemo(
    () =>
      dayQuery.data?.find((item) => item.day === day)?.schedules.length ?? 0,
    [dayQuery.data, day],
  )

  return (
    <div className="flex w-full flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight">
          My Teaching Schedule
        </h1>
        <p className="text-sm text-muted-foreground">
          Your classes for {WEEK_DAY_LABELS[day]} on the school time grid.
        </p>
      </div>
      <div className="grid items-start gap-4 lg:grid-cols-[240px_1fr]">
        <div
          role="tablist"
          aria-label="Days of week"
          className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-1"
        >
          {WEEK_DAYS.map((d) => {
            const count = weekQuery.data?.[d]?.length ?? 0
            const isActive = d === day
            return (
              <button
                key={d}
                role="tab"
                type="button"
                aria-selected={isActive}
                onClick={() => setDay(d)}
                className={cn(
                  'flex items-center justify-between gap-2 rounded-lg border px-3 py-2.5 text-left text-sm transition-colors',
                  isActive
                    ? 'border-primary/40 bg-primary/5 font-medium'
                    : 'border-border bg-card text-muted-foreground hover:bg-muted/60 hover:text-foreground',
                )}
              >
                <span>{WEEK_DAY_LABELS[d]}</span>
                {weekQuery.isPending ? (
                  <Skeleton className="h-5 w-8" />
                ) : (
                  <Badge
                    variant={count === 0 ? 'secondary' : 'outline'}
                    className="shrink-0"
                  >
                    {count}
                  </Badge>
                )}
              </button>
            )
          })}
        </div>
        <Card>
          <CardContent className="pt-6">
            {dayQuery.isPending || weekQuery.isPending ? (
              <GridSkeleton />
            ) : dayQuery.isError ? (
              <GridError
                title="Failed to load time range"
                onRetry={() => dayQuery.refetch()}
              />
            ) : slots.length === 0 ? (
              <Empty>
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <IconCalendarOff />
                  </EmptyMedia>
                  <EmptyTitle>Holiday</EmptyTitle>
                  <EmptyDescription>
                    No time slots configured for {WEEK_DAY_LABELS[day]}.
                  </EmptyDescription>
                </EmptyHeader>
              </Empty>
            ) : weekQuery.isError ? (
              <GridError
                title="Failed to load your schedules"
                onRetry={() => weekQuery.refetch()}
              />
            ) : (
              <>
                <p className="mb-3 text-xs text-muted-foreground tabular-nums">
                  {slotCount} slots · {events.length} sessions
                </p>
                <TeacherScheduleGrid slots={slots} events={events} />
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function GridSkeleton() {
  return (
    <div className="flex gap-3" aria-busy="true" aria-live="polite">
      <div className="flex w-28 flex-col gap-4 sm:w-36">
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
      <Button variant="outline" onClick={() => onRetry()}>
        <IconRotateClockwise className="size-4" />
        Retry
      </Button>
    </Empty>
  )
}
