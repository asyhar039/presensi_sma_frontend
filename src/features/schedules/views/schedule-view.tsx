import type {
  IClassSchedule,
  IDraftRange,
  ISelectedSlot,
} from '@/features/schedules/types/schedule.types'
import type { WeekDay } from '@/features/settings/types/schedule-clock.types'

import { useMemo, useState } from 'react'
import { toast } from 'sonner'

import { ScheduleDayTabs } from '@/features/schedules/components/schedule-day-tabs'
import { ScheduleEventDialog } from '@/features/schedules/components/schedule-event-dialog'
import { ScheduleFilterCard } from '@/features/schedules/components/schedule-filter-card'
import { ScheduleGridCard } from '@/features/schedules/components/schedule-grid-card'
import {
  useClassSchedules,
  useUpdateClassSchedule,
} from '@/features/schedules/hooks/use-class-schedules'
import { useDaySchedules } from '@/features/settings/hooks/use-settings-schedules'
import { getErrorMessage } from '@/utils/error'

function useScheduleSelection(day: WeekDay, classroomId: number | null) {
  const [selection, setSelection] = useState<ISelectedSlot | null>(null)
  const openCreate = (draft: IDraftRange) => {
    if (!classroomId) return
    setSelection({ day, classroomId, draft, entry: null })
  }
  const openEdit = (entry: IClassSchedule) => {
    if (!classroomId) return
    setSelection({
      day,
      classroomId,
      draft: { start: entry.start_time, end: entry.end_time },
      entry,
    })
  }
  const close = () => setSelection(null)
  return { selection, openCreate, openEdit, close, setSelection }
}

export function ScheduleView() {
  const [yearId, setYearId] = useState('')
  const [classroomId, setClassroomId] = useState('')
  const [day, setDay] = useState<WeekDay>('monday')

  const classId = Number(classroomId)
  const readyId =
    yearId && Number.isFinite(classId) && classId > 0 ? classId : null

  const dayQuery = useDaySchedules()
  const entryQuery = useClassSchedules(readyId, day)
  const updateMutation = useUpdateClassSchedule()
  const { selection, openCreate, openEdit, close, setSelection } =
    useScheduleSelection(day, readyId)

  const slots = useMemo(
    () => dayQuery.data?.find((item) => item.day === day)?.schedules ?? [],
    [dayQuery.data, day],
  )

  const applyDraft = async (entry: IClassSchedule, draft: IDraftRange) => {
    try {
      await updateMutation.mutateAsync({
        id: entry.id,
        payload: { start_time: draft.start, end_time: draft.end },
      })
    } catch (error) {
      toast.error(getErrorMessage(error, 'Failed to move schedule.'))
    }
  }

  const handleMove = (entry: IClassSchedule, draft: IDraftRange) => {
    void applyDraft(entry, draft)
  }

  const handleResize = (entry: IClassSchedule, draft: IDraftRange) => {
    void applyDraft(entry, draft)
  }

  const handleDayChange = (next: WeekDay) => {
    setDay(next)
    setSelection(null)
  }

  return (
    <div className="flex w-full flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight">Schedules</h1>
        <p className="text-sm text-muted-foreground">
          Pick an academic year and class, then manage each day on the time
          grid.
        </p>
      </div>
      <ScheduleFilterCard
        yearId={yearId}
        classroomId={classroomId}
        onYear={(next) => setYearId(next ?? '')}
        onClassroom={(next) => setClassroomId(next ?? '')}
      />
      <ScheduleDayTabs active={day} onChange={handleDayChange} />
      <ScheduleGridCard
        day={day}
        classroomId={readyId}
        slots={slots}
        events={entryQuery.data ?? []}
        isDayLoading={dayQuery.isPending}
        isDayError={dayQuery.isError}
        isEventsLoading={entryQuery.isPending}
        isEventsError={entryQuery.isError}
        onRetryDay={() => dayQuery.refetch()}
        onRetryEvents={() => entryQuery.refetch()}
        onEmptyClick={openCreate}
        onEventClick={openEdit}
        onEventMove={handleMove}
        onEventResize={handleResize}
      />
      <ScheduleEventDialog selection={selection} onClose={close} />
    </div>
  )
}
