import type { ITeacherSchedule } from '@/features/schedules/types/schedule.types'
import type { IScheduleSlot } from '@/features/settings/types/schedule-clock.types'

import { IconCoffee } from '@tabler/icons-react'
import { useMemo } from 'react'

import {
  eventStyle,
  layoutDayEvents,
} from '@/features/schedules/lib/schedule-layout'
import { scaleOf, toMinutes } from '@/features/schedules/lib/schedule-time'

const PX_PER_MIN = 2

type TeacherScheduleGridProps = {
  slots: IScheduleSlot[]
  events: ITeacherSchedule[]
}

function rowHeight(slot: IScheduleSlot) {
  return Math.max(toMinutes(slot.end) - toMinutes(slot.start), 5) * PX_PER_MIN
}

export function TeacherScheduleGrid({
  slots,
  events,
}: TeacherScheduleGridProps) {
  const scale = useMemo(() => scaleOf(slots), [slots])
  const placed = useMemo(() => layoutDayEvents(events), [events])
  const periods = useMemo(() => {
    let period = -1
    return slots.map((slot) => (slot.is_break ? null : ++period))
  }, [slots])

  if (!scale) return null

  return (
    <div className="flex overflow-x-auto">
      <div className="w-28 shrink-0 sm:w-36" aria-hidden="true">
        <div className="h-8 border-b" />
        {slots.map((slot, i) => (
          <div
            key={`${slot.start}-${i}`}
            style={{ height: rowHeight(slot) }}
            className="flex flex-col justify-center border-b pr-2 text-right last:border-b-0"
          >
            {slot.is_break ? (
              <span className="text-[11px] font-medium text-amber-700 dark:text-amber-400">
                Break
              </span>
            ) : (
              <span className="text-xs font-semibold tabular-nums">
                P{periods[i]}
              </span>
            )}
            <span className="text-[11px] tabular-nums text-muted-foreground">
              {slot.start} – {slot.end}
            </span>
          </div>
        ))}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex h-8 items-center border-b px-3 text-[11px] font-medium text-muted-foreground">
          Schedule
        </div>
        <div style={{ height: scale.total * PX_PER_MIN }} className="relative">
          {slots.map((slot, i) =>
            slot.is_break ? (
              <div
                key={`${slot.start}-${i}`}
                style={{ height: rowHeight(slot) }}
                className="relative z-10 flex items-center gap-2 border-b border-dashed bg-amber-500/10 px-3 last:border-b-0"
              >
                <IconCoffee className="size-3.5 shrink-0 text-amber-600" />
                <span className="truncate text-xs font-medium text-amber-700 dark:text-amber-400">
                  Break · {slot.start} – {slot.end}
                </span>
              </div>
            ) : (
              <div
                key={`${slot.start}-${i}`}
                style={{ height: rowHeight(slot) }}
                className="border-b last:border-b-0"
              />
            ),
          )}
          {placed.map(({ event, lane, lanes }) => {
            const style = eventStyle(
              event,
              { lane, lanes },
              scale.start,
              scale.total,
            )
            return (
              <div
                key={event.id}
                className="absolute z-0"
                style={{
                  left: style.left,
                  width: style.width,
                  top: style.top,
                  height: style.height,
                }}
              >
                <div className="absolute inset-x-1 top-0 bottom-0 overflow-hidden rounded-md border border-primary/30 bg-primary/10 p-1.5">
                  <p className="truncate text-xs font-semibold">
                    {event.classroom.name}
                  </p>
                  <p className="truncate text-[11px] text-muted-foreground">
                    {event.subjects.map((s) => s.name).join(' · ') ||
                      `${event.start_time} – ${event.end_time}`}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
