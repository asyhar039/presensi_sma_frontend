import type {
  IClassSchedule,
  IDraftRange,
} from '@/features/schedules/types/schedule.types'
import type { IScheduleSlot } from '@/features/settings/types/schedule-clock.types'

import {
  DndContext,
  type DragEndEvent,
  PointerSensor,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { IconCoffee } from '@tabler/icons-react'
import { useMemo, useRef } from 'react'

import {
  eventStyle,
  layoutDayEvents,
} from '@/features/schedules/lib/schedule-layout'
import {
  clampRange,
  scaleOf,
  snapMinutes,
  toMinutes,
  toTime,
} from '@/features/schedules/lib/schedule-time'
import { cn } from '@/lib/class-name'

const PX_PER_MIN = 2

type ScheduleDayGridProps = {
  slots: IScheduleSlot[]
  events: IClassSchedule[]
  onEmptyClick: (draft: IDraftRange) => void
  onEventClick: (entry: IClassSchedule) => void
  onEventMove: (entry: IClassSchedule, draft: IDraftRange) => void
  onEventResize: (entry: IClassSchedule, draft: IDraftRange) => void
}

type RowProps = {
  slot: IScheduleSlot
  period: number | null
  height: number
  onPick: (slot: IScheduleSlot) => void
}

type BlockProps = {
  entry: IClassSchedule
  lane: number
  lanes: number
  scaleStart: number
  scaleTotal: number
  onOpen: (entry: IClassSchedule) => void
}

type HandleProps = {
  id: string
  entry: IClassSchedule
  edge: 'start' | 'end'
  scaleStart: number
  scaleTotal: number
  gridHeight: number
}

function minutesOf(slot: IScheduleSlot): number {
  return Math.max(toMinutes(slot.end) - toMinutes(slot.start), 5)
}

function TemplateRow({ slot, period, height, onPick }: RowProps) {
  if (slot.is_break) {
    return (
      <div
        style={{ height }}
        className="flex items-center gap-2 border-b border-dashed bg-amber-500/10 px-3"
      >
        <IconCoffee className="size-3.5 shrink-0 text-amber-600" />
        <span className="text-xs font-medium text-amber-700 dark:text-amber-400">
          Break · {slot.start} – {slot.end}
        </span>
      </div>
    )
  }
  return (
    <button
      type="button"
      onClick={() => onPick(slot)}
      style={{ height }}
      className="group flex w-full items-center gap-2 border-b px-3 text-left transition-colors last:border-b-0 hover:bg-primary/5"
    >
      <span className="text-xs font-semibold tabular-nums">P{period}</span>
      <span className="text-xs text-muted-foreground tabular-nums">
        {slot.start} – {slot.end}
      </span>
      <span className="ml-auto hidden text-xs font-medium text-primary group-hover:inline">
        + Add
      </span>
    </button>
  )
}

function ResizeHandle({
  id,
  entry,
  edge,
  scaleStart,
  scaleTotal,
  gridHeight,
}: HandleProps) {
  const { attributes, listeners, setNodeRef } = useDraggable({
    id,
    data: { kind: 'resize', edge, entry },
  })
  return (
    <button
      type="button"
      aria-label={`Resize ${edge} edge`}
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      data-edge={edge}
      onPointerDown={(event) => event.stopPropagation()}
      onClick={(event) => event.stopPropagation()}
      className={cn(
        'absolute right-1 left-1 z-10 h-2 cursor-ns-resize rounded-full opacity-0 transition-opacity group-hover/event:opacity-100',
        'bg-primary/60 hover:bg-primary',
        edge === 'start' ? '-top-1' : '-bottom-1',
      )}
      // ponytail: dnd-kit delta is px; convert with gridHeight/scaleTotal held by parent via data attrs.
      data-scale-start={scaleStart}
      data-scale-total={scaleTotal}
      data-grid-height={gridHeight}
      data-entry-start={entry.start_time}
      data-entry-end={entry.end_time}
    />
  )
}

function EventBlock({
  entry,
  lane,
  lanes,
  scaleStart,
  scaleTotal,
  onOpen,
}: BlockProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: `move-${entry.id}`,
      data: { kind: 'move', entry },
    })
  const style = eventStyle(entry, { lane, lanes }, scaleStart, scaleTotal)
  return (
    <div
      className="group/event absolute"
      style={{
        left: style.left,
        width: style.width,
        top: style.top,
        height: style.height,
        transform: transform ? `translateY(${transform.y}px)` : undefined,
      }}
    >
      <button
        type="button"
        ref={setNodeRef}
        {...attributes}
        {...listeners}
        onClick={() => onOpen(entry)}
        className={cn(
          'absolute inset-x-1 top-0 bottom-0 cursor-grab overflow-hidden rounded-md border border-primary/30 bg-primary/10 p-1.5 text-center active:cursor-grabbing',
          lanes > 1 && 'inset-x-0.5',
          isDragging && 'z-20 opacity-80 shadow-lg',
        )}
      >
        <span className="block truncate text-md font-semibold">
          {entry.teacher?.name ?? 'No teacher'}
        </span>
        {entry.teacher?.subjects?.[0] && (
          <span className="block truncate text-sm text-muted-foreground">
            {entry.teacher.subjects[0].name}
          </span>
        )}
        <span className="block text-xs tabular-nums dark:text-muted-foreground">
          {entry.start_time} – {entry.end_time}
        </span>
      </button>
      <ResizeHandle
        id={`resize-start-${entry.id}`}
        entry={entry}
        edge="start"
        scaleStart={scaleStart}
        scaleTotal={scaleTotal}
        gridHeight={0}
      />
      <ResizeHandle
        id={`resize-end-${entry.id}`}
        entry={entry}
        edge="end"
        scaleStart={scaleStart}
        scaleTotal={scaleTotal}
        gridHeight={0}
      />
    </div>
  )
}

export function ScheduleDayGrid({
  slots,
  events,
  onEmptyClick,
  onEventClick,
  onEventMove,
  onEventResize,
}: ScheduleDayGridProps) {
  const gridRef = useRef<HTMLDivElement>(null)
  const { setNodeRef } = useDroppable({ id: 'day-grid' })
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
  )

  const scale = useMemo(() => scaleOf(slots), [slots])
  const placed = useMemo(() => layoutDayEvents(events), [events])

  const periods = useMemo(() => {
    let period = 0
    return slots.map((slot) => (slot.is_break ? null : ++period))
  }, [slots])

  if (!scale) return null
  const gridHeight = scale.total * PX_PER_MIN

  const handleDragEnd = (event: DragEndEvent) => {
    const kind = event.active.data.current?.kind as string | undefined
    const entry = event.active.data.current?.entry as IClassSchedule | undefined
    if (!entry) return
    const deltaMinutes = snapMinutes((event.delta.y / gridHeight) * scale.total)
    if (deltaMinutes === 0) return
    const start = toMinutes(entry.start_time)
    const end = toMinutes(entry.end_time)
    if (kind === 'resize') {
      const edge = event.active.data.current?.edge as 'start' | 'end'
      const next =
        edge === 'start'
          ? clampRange(start + deltaMinutes, end, scale)
          : clampRange(start, end + deltaMinutes, scale)
      onEventResize(entry, { start: toTime(next.start), end: toTime(next.end) })
      return
    }
    const length = end - start
    const next = clampRange(
      start + deltaMinutes,
      start + deltaMinutes + length,
      scale,
    )
    onEventMove(entry, { start: toTime(next.start), end: toTime(next.end) })
  }

  const handleGridClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('[role="button"],button')) return
    const rect = gridRef.current?.getBoundingClientRect()
    if (!rect) return
    const minutes =
      scale.start +
      snapMinutes(((e.clientY - rect.top) / rect.height) * scale.total)
    const start = Math.max(scale.start, Math.min(minutes, scale.end - 5))
    onEmptyClick({
      start: toTime(start),
      end: toTime(Math.min(start + 30, scale.end)),
    })
  }

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <div className="flex overflow-x-auto">
        <div className="w-20 shrink-0 sm:w-28">
          <div className="h-8 border-b text-[11px] font-medium text-muted-foreground" />
          {slots.map((slot, i) => (
            <div
              key={`${slot.start}-${i}`}
              style={{ height: minutesOf(slot) * PX_PER_MIN }}
              className="relative border-b pr-2 text-right last:border-b-0"
            >
              <span className="absolute top-1 right-2 text-[11px] tabular-nums text-muted-foreground">
                {slot.start}
              </span>
              {i === slots.length - 1 && (
                <span className="absolute right-2 bottom-1 text-[11px] tabular-nums text-muted-foreground">
                  {slot.end}
                </span>
              )}
            </div>
          ))}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex h-8 items-center border-b px-3 text-[11px] font-medium text-muted-foreground">
            Schedule
          </div>
          {/* biome-ignore lint/a11y/noStaticElementInteractions: empty-grid click creates a schedule at that time. */}
          {/* biome-ignore lint/a11y/useKeyWithClickEvents: template rows are buttons; this is a pointer shortcut only. */}
          <div
            ref={(node) => {
              gridRef.current = node
              setNodeRef(node)
            }}
            onClick={handleGridClick}
            style={{ height: gridHeight }}
            className="relative"
          >
            {slots.map((slot, i) => (
              <TemplateRow
                key={`${slot.start}-${i}`}
                slot={slot}
                period={periods[i]}
                height={minutesOf(slot) * PX_PER_MIN}
                onPick={(picked) =>
                  onEmptyClick({ start: picked.start, end: picked.end })
                }
              />
            ))}
            {placed.map((p) => (
              <EventBlock
                key={p.event.id}
                entry={p.event}
                lane={p.lane}
                lanes={p.lanes}
                scaleStart={scale.start}
                scaleTotal={scale.total}
                onOpen={onEventClick}
              />
            ))}
          </div>
        </div>
      </div>
    </DndContext>
  )
}
