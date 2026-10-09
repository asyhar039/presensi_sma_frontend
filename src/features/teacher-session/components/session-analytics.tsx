import type { ISessionAnalytics } from '@/features/teacher-session/types/teacher-session.types'

import {
  IconCalendarCheck,
  IconClock,
  IconLogout,
  IconNotes,
  IconUsers,
} from '@tabler/icons-react'

import { Card, CardContent } from '@/components/ui/card'

function Stat({
  icon,
  label,
  value,
  tone,
}: {
  icon: React.ReactNode
  label: string
  value: number
  tone: string
}) {
  return (
    <Card>
      <CardContent className="flex items-center gap-3 p-4">
        <span
          className={`flex size-10 items-center justify-center rounded-lg ${tone}`}
        >
          {icon}
        </span>
        <span>
          <span className="block text-2xl font-bold leading-none">{value}</span>
          <span className="text-xs text-muted-foreground">{label}</span>
        </span>
      </CardContent>
    </Card>
  )
}

export function SessionAnalytics({
  analytics,
}: {
  analytics: ISessionAnalytics
}) {
  return (
    <div className="grid grid-cols-2 gap-3 xl:grid-cols-3">
      <Stat
        icon={<IconUsers className="size-5" />}
        label="Students"
        value={analytics.total_students}
        tone="bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
      />
      <Stat
        icon={<IconCalendarCheck className="size-5" />}
        label="Present"
        value={analytics.total_present}
        tone="bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300"
      />
      <Stat
        icon={<IconNotes className="size-5" />}
        label="Sick"
        value={analytics.total_sick}
        tone="bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
      />
      <Stat
        icon={<IconNotes className="size-5" />}
        label="Permit"
        value={analytics.total_permit}
        tone="bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300"
      />
      <Stat
        icon={<IconLogout className="size-5" />}
        label="Early out"
        value={analytics.total_early_out}
        tone="bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300"
      />
      <Stat
        icon={<IconClock className="size-5" />}
        label="Late arrival"
        value={analytics.total_late_arrival}
        tone="bg-cyan-100 text-cyan-700 dark:bg-cyan-950 dark:text-cyan-300"
      />
    </div>
  )
}
