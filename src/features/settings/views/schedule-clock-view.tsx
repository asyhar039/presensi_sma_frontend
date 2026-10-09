import { ScheduleClockSection } from '@/features/settings/components/schedule-clock-section'

export function ScheduleClockView() {
  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-muted-foreground">
        Set daily clock-in sessions for each day. Days without sessions are
        treated as holidays. Drag sessions to reorder them.
      </p>
      <ScheduleClockSection />
    </div>
  )
}
