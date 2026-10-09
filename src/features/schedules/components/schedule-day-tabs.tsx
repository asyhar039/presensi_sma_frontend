import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  WEEK_DAYS,
  WEEK_DAY_LABELS,
  type WeekDay,
} from '@/features/settings/types/schedule-clock.types'
import { cn } from '@/lib/class-name'

type ScheduleDayTabsProps = {
  active: WeekDay
  onChange: (day: WeekDay) => void
}

export function ScheduleDayTabs({ active, onChange }: ScheduleDayTabsProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div
          className="flex gap-1.5 overflow-x-auto"
          role="tablist"
          aria-label="Days of week"
        >
          {WEEK_DAYS.map((day) => {
            const selected = day === active
            return (
              <Button
                key={day}
                role="tab"
                aria-selected={selected}
                variant={selected ? 'default' : 'ghost'}
                size="sm"
                onClick={() => onChange(day)}
                className={cn(
                  'shrink-0 capitalize',
                  !selected && 'text-muted-foreground',
                )}
              >
                {WEEK_DAY_LABELS[day]}
              </Button>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
