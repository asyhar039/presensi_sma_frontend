import type { ITeacherAttendanceCounts } from '@/features/teacher-attendance/types/teacher-attendance.types'

import {
  IconCalendarCheck,
  IconCalendarX,
  IconHourglass,
  IconNotes,
  IconStethoscope,
} from '@tabler/icons-react'

import { Card, CardContent } from '@/components/ui/card'

type StatProps = {
  icon: React.ReactNode
  label: string
  value: string | number
  tone: string
}

function Stat({ icon, label, value, tone }: StatProps) {
  return (
    <Card>
      <CardContent className="flex items-center gap-3 p-4">
        <span
          className={`flex size-10 shrink-0 items-center justify-center rounded-lg ${tone}`}
        >
          {icon}
        </span>
        <span className="min-w-0">
          <span className="block truncate text-2xl font-bold leading-none tabular-nums">
            {value}
          </span>
          <span className="text-xs text-muted-foreground">{label}</span>
        </span>
      </CardContent>
    </Card>
  )
}

type TeacherStatCardsProps = {
  attendance: ITeacherAttendanceCounts
}

export function TeacherStatCards({ attendance }: TeacherStatCardsProps) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-5">
      <Stat
        icon={<IconCalendarCheck className="size-5" />}
        label="Effective days"
        value={attendance.total_effective_days}
        tone="bg-primary/10 text-primary"
      />
      <Stat
        icon={<IconNotes className="size-5" />}
        label="Present"
        value={attendance.present}
        tone="bg-emerald-500/10 text-emerald-600"
      />
      <Stat
        icon={<IconStethoscope className="size-5" />}
        label="Sick"
        value={attendance.sick_leave}
        tone="bg-amber-500/10 text-amber-600"
      />
      <Stat
        icon={<IconHourglass className="size-5" />}
        label="Permit"
        value={attendance.permit}
        tone="bg-sky-500/10 text-sky-600"
      />
      <Stat
        icon={<IconCalendarX className="size-5" />}
        label="Absent"
        value={attendance.alpha}
        tone="bg-destructive/10 text-destructive"
      />
    </div>
  )
}
