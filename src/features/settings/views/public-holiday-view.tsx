import { PublicHolidaySection } from '@/features/settings/components/public-holiday-section'

export function PublicHolidayView() {
  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-muted-foreground">
        Manage public holidays on the calendar. Click a date to add or edit a
        holiday.
      </p>
      <PublicHolidaySection />
    </div>
  )
}
