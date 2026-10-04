import type { IClassSchedule } from '@/features/schedules/types/schedule.types'

import { toMinutes } from '@/features/schedules/lib/schedule-time'

export interface PlacedEvent {
  event: IClassSchedule
  lane: number
  lanes: number
}

function overlaps(a: IClassSchedule, b: IClassSchedule): boolean {
  return (
    toMinutes(a.start_time) < toMinutes(b.end_time) &&
    toMinutes(b.start_time) < toMinutes(a.end_time)
  )
}

export function layoutDayEvents(events: IClassSchedule[]): PlacedEvent[] {
  const sorted = [...events].sort(
    (a, b) =>
      toMinutes(a.start_time) - toMinutes(b.start_time) ||
      toMinutes(a.end_time) - toMinutes(b.end_time),
  )
  const placed: (PlacedEvent & { stop: number })[] = []
  for (const event of sorted) {
    const start = toMinutes(event.start_time)
    const cluster = placed.filter(
      (p) =>
        !(
          toMinutes(p.event.end_time) <= start ||
          toMinutes(p.event.start_time) >= toMinutes(event.end_time)
        ),
    )
    void cluster
    const live = placed.filter((p) => p.stop > start)
    const used = new Set(live.map((p) => p.lane))
    let lane = 0
    while (used.has(lane)) lane += 1
    placed.push({ event, lane, lanes: 1, stop: toMinutes(event.end_time) })
  }

  const groups: (PlacedEvent & { stop: number })[][] = []
  const byStart = [...placed].sort(
    (a, b) => toMinutes(a.event.start_time) - toMinutes(b.event.start_time),
  )
  for (const item of byStart) {
    const group = groups.find((g) =>
      g.some((m) => overlaps(m.event, item.event)),
    )
    if (group) group.push(item)
    else groups.push([item])
  }
  for (const group of groups) {
    const width = Math.max(...group.map((g) => g.lane)) + 1
    for (const item of group) item.lanes = width
  }
  return placed.map(({ stop: _stop, ...rest }) => rest)
}

export function eventStyle(
  event: IClassSchedule,
  placed: Pick<PlacedEvent, 'lane' | 'lanes'>,
  scaleStart: number,
  scaleTotal: number,
): { top: string; height: string; left: string; width: string } {
  const start = toMinutes(event.start_time) - scaleStart
  const stop = toMinutes(event.end_time) - scaleStart
  const laneWidth = 100 / placed.lanes
  return {
    top: `${(start / scaleTotal) * 100}%`,
    height: `${Math.max(((stop - start) / scaleTotal) * 100, 2)}%`,
    left: `${placed.lane * laneWidth}%`,
    width: `${laneWidth}%`,
  }
}
