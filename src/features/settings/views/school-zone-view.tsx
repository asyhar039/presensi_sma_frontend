import { SchoolZoneSection } from '@/features/settings/components/school-zone-section'

export function SchoolZoneView() {
  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-muted-foreground">
        Draw school zone boundaries on the map. Each zone needs at least 3
        points.
      </p>
      <SchoolZoneSection />
    </div>
  )
}
