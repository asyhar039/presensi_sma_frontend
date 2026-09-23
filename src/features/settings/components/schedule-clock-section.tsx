import type {
  IScheduleSlot,
  WeekDay,
} from '@/features/settings/types/settings.types'

import {
  IconCalendarOff,
  IconClock,
  IconPlus,
  IconRotateClockwise,
  IconTrash,
} from '@tabler/icons-react'
import { useMemo, useState } from 'react'

import { ButtonLoading } from '@/components/composite/button-loading'
import {
  ReorderableHandle,
  ReorderableList,
} from '@/components/composite/reorderable-list'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'
import {
  useDaySchedules,
  useUpdateDaySchedule,
} from '@/features/settings/hooks/use-settings-schedules'
import {
  WEEK_DAYS,
  WEEK_DAY_LABELS,
  isWeekDay,
} from '@/features/settings/types/settings.types'
import { cn } from '@/lib/class-name'

type SlotDraft = IScheduleSlot & { key: string }

let slotKeySeed = 0

function createSlotKey(): string {
  slotKeySeed += 1
  return `slot-${Date.now().toString(36)}-${slotKeySeed}`
}

function toDrafts(slots: IScheduleSlot[]): SlotDraft[] {
  return slots.map((slot) => ({ ...slot, key: createSlotKey() }))
}

function stripKeys(slots: SlotDraft[]): IScheduleSlot[] {
  return slots.map(({ key: _key, ...slot }) => ({
    ...slot,
    is_break: slot.is_break ?? false,
  }))
}

function addMinutes(time: string, minutes: number): string {
  const [hours, mins] = time.split(':').map(Number)
  const total = Math.min(hours * 60 + mins + minutes, 23 * 60 + 59)
  const nextHours = Math.floor(total / 60)
  const nextMins = total % 60
  return `${String(nextHours).padStart(2, '0')}:${String(nextMins).padStart(2, '0')}`
}

function nextDefaultRange(slots: SlotDraft[]): { start: string; end: string } {
  const last = slots[slots.length - 1]
  const start = last && last.end > last.start ? last.end : '07:00'
  const end = addMinutes(start, 60)
  if (end <= start) return { start, end: '23:59' }
  return { start, end }
}

const TIME_PATTERN = /^([01]\d|2[0-3]):[0-5]\d$/

function findSlotIssues(slots: SlotDraft[]): Set<string> {
  const invalid = new Set<string>()
  for (const slot of slots) {
    if (
      !TIME_PATTERN.test(slot.start) ||
      !TIME_PATTERN.test(slot.end) ||
      slot.start >= slot.end
    ) {
      invalid.add(slot.key)
    }
  }

  const ordered = [...slots].sort((a, b) => a.start.localeCompare(b.start))
  for (let index = 1; index < ordered.length; index += 1) {
    const previous = ordered[index - 1]
    const current = ordered[index]
    if (
      TIME_PATTERN.test(previous.start) &&
      TIME_PATTERN.test(previous.end) &&
      TIME_PATTERN.test(current.start) &&
      current.start < previous.end
    ) {
      invalid.add(previous.key)
      invalid.add(current.key)
    }
  }

  return invalid
}

function formatRange(slot: IScheduleSlot): string {
  return `${slot.start} – ${slot.end}`
}

function DayScheduleCard({
  day,
  initial,
}: {
  day: WeekDay
  initial: IScheduleSlot[]
}) {
  const updateMutation = useUpdateDaySchedule()
  const [slots, setSlots] = useState<SlotDraft[]>(() => toDrafts(initial))

  const issues = useMemo(() => findSlotIssues(slots), [slots])
  const isHoliday = slots.length === 0
  const isDirty =
    JSON.stringify(stripKeys(slots)) !==
    JSON.stringify(stripKeys(toDrafts(initial)))

  const handleAdd = () => {
    const range = nextDefaultRange(slots)
    setSlots((previous) => [
      ...previous,
      { ...range, is_break: false, key: createSlotKey() },
    ])
  }

  const handlePatch = (key: string, patch: Partial<IScheduleSlot>) => {
    setSlots((previous) =>
      previous.map((slot) => (slot.key === key ? { ...slot, ...patch } : slot)),
    )
  }

  const handleRemove = (key: string) => {
    setSlots((previous) => previous.filter((slot) => slot.key !== key))
  }

  const handleReset = () => {
    setSlots(toDrafts(initial))
  }

  const handleSave = async () => {
    if (issues.size > 0 || updateMutation.isPending) return
    await updateMutation.mutateAsync({ day, schedules: stripKeys(slots) })
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <CardTitle className="flex items-center gap-2">
              <IconClock className="size-4 text-muted-foreground" />
              {WEEK_DAY_LABELS[day]}
            </CardTitle>
            <CardDescription>
              {isHoliday
                ? 'No sessions — this day is treated as a holiday.'
                : `${slots.length} session${slots.length > 1 ? 's' : ''} · drag to reorder`}
            </CardDescription>
          </div>
          {isHoliday ? (
            <Badge variant="secondary">Holiday</Badge>
          ) : (
            <Badge>{slots.length}</Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {isHoliday ? (
          <Empty className="border border-dashed p-8">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <IconCalendarOff />
              </EmptyMedia>
              <EmptyTitle>Marked as holiday</EmptyTitle>
              <EmptyDescription>
                Add a session below to schedule clock-in times for{' '}
                {WEEK_DAY_LABELS[day].toLowerCase()}.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <div className="flex flex-col gap-2">
            <ReorderableList
              items={slots}
              getKey={(slot) => slot.key}
              onReorder={setSlots}
              disabled={updateMutation.isPending}
              renderItem={(slot) => {
                const hasIssue = issues.has(slot.key)
                return (
                  <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
                    <ReorderableHandle />
                    <div className="flex min-w-0 flex-1 items-center gap-2">
                      <Input
                        type="time"
                        aria-label="Start time"
                        value={slot.start}
                        disabled={updateMutation.isPending}
                        aria-invalid={hasIssue}
                        onChange={(event) =>
                          handlePatch(slot.key, { start: event.target.value })
                        }
                        className={cn(
                          'min-w-0 flex-1',
                          hasIssue && 'border-destructive',
                        )}
                      />
                      <span className="shrink-0 text-muted-foreground">–</span>
                      <Input
                        type="time"
                        aria-label="End time"
                        value={slot.end}
                        disabled={updateMutation.isPending}
                        aria-invalid={hasIssue}
                        onChange={(event) =>
                          handlePatch(slot.key, { end: event.target.value })
                        }
                        className={cn(
                          'min-w-0 flex-1',
                          hasIssue && 'border-destructive',
                        )}
                      />
                    </div>
                    <div className="flex shrink-0 items-center gap-1.5">
                      <Checkbox
                        id={`${slot.key}-break`}
                        checked={slot.is_break}
                        disabled={updateMutation.isPending}
                        onCheckedChange={(checked) =>
                          handlePatch(slot.key, { is_break: checked === true })
                        }
                      />
                      <Label
                        htmlFor={`${slot.key}-break`}
                        className="text-xs font-normal text-muted-foreground"
                      >
                        Break
                      </Label>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      disabled={updateMutation.isPending}
                      onClick={() => handleRemove(slot.key)}
                      aria-label={`Remove session ${formatRange(slot)}`}
                      className="shrink-0 text-muted-foreground hover:text-destructive"
                    >
                      <IconTrash className="size-4" />
                    </Button>
                  </div>
                )
              }}
            />
            {issues.size > 0 && (
              <p className="text-xs text-destructive">
                Fix highlighted sessions: end time must be after start time and
                sessions must not overlap.
              </p>
            )}
          </div>
        )}

        <div className="flex flex-col gap-2 border-t border-border pt-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={updateMutation.isPending}
              onClick={handleAdd}
            >
              <IconPlus className="size-4" />
              Add session
            </Button>
            {!isHoliday && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                disabled={updateMutation.isPending}
                onClick={() => setSlots([])}
                className="text-muted-foreground"
              >
                <IconCalendarOff className="size-4" />
                Mark as holiday
              </Button>
            )}
          </div>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={!isDirty || updateMutation.isPending}
              onClick={handleReset}
            >
              <IconRotateClockwise className="size-4" />
              Reset
            </Button>
            <ButtonLoading
              size="sm"
              loading={updateMutation.isPending}
              disabled={!isDirty || issues.size > 0}
              onClick={handleSave}
            >
              Save {WEEK_DAY_LABELS[day].toLowerCase()}
            </ButtonLoading>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function ScheduleClockSection() {
  const schedulesQuery = useDaySchedules()
  const [activeDay, setActiveDay] = useState<WeekDay>('monday')

  const byDay = useMemo(() => {
    const map = Object.fromEntries(
      WEEK_DAYS.map((day) => [day, []] as [WeekDay, IScheduleSlot[]]),
    ) as Record<WeekDay, IScheduleSlot[]>
    for (const item of schedulesQuery.data ?? []) {
      if (isWeekDay(item.day)) {
        map[item.day] = item.schedules
      }
    }
    return map
  }, [schedulesQuery.data])

  if (schedulesQuery.isPending) {
    return (
      <div className="grid gap-4 lg:grid-cols-[240px_1fr]">
        <div className="flex flex-col gap-2">
          {WEEK_DAYS.map((day) => (
            <Skeleton key={day} className="h-12 w-full" />
          ))}
        </div>
        <Skeleton className="h-96 w-full" />
      </div>
    )
  }

  if (schedulesQuery.isError) {
    return (
      <Empty className="border">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <IconClock />
          </EmptyMedia>
          <EmptyTitle>Failed to load schedules</EmptyTitle>
          <EmptyDescription>
            We could not load the schedule clock. Please try again.
          </EmptyDescription>
        </EmptyHeader>
        <Button variant="outline" onClick={() => schedulesQuery.refetch()}>
          <IconRotateClockwise className="size-4" />
          Retry
        </Button>
      </Empty>
    )
  }

  const activeSlots = byDay[activeDay]

  return (
    <div className="grid items-start gap-4 lg:grid-cols-[240px_1fr]">
      <div
        role="tablist"
        aria-label="Days of week"
        className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-1"
      >
        {WEEK_DAYS.map((day) => {
          const count = byDay[day].length
          const isActive = day === activeDay
          return (
            <button
              key={day}
              role="tab"
              type="button"
              aria-selected={isActive}
              onClick={() => setActiveDay(day)}
              className={cn(
                'flex items-center justify-between gap-2 rounded-lg border px-3 py-2.5 text-left text-sm transition-colors',
                isActive
                  ? 'border-primary/40 bg-primary/5 font-medium'
                  : 'border-border bg-card text-muted-foreground hover:bg-muted/60 hover:text-foreground',
              )}
            >
              <span>{WEEK_DAY_LABELS[day]}</span>
              {count === 0 ? (
                <Badge variant="secondary" className="shrink-0">
                  Holiday
                </Badge>
              ) : (
                <Badge variant="outline" className="shrink-0">
                  {count}
                </Badge>
              )}
            </button>
          )
        })}
      </div>

      <DayScheduleCard
        key={`${activeDay}-${JSON.stringify(activeSlots)}`}
        day={activeDay}
        initial={activeSlots}
      />
    </div>
  )
}
