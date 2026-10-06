import type { LeaveRequestType } from '@/features/student-permits/types/permit.types'

import { IconClock, IconLogout, IconStethoscope } from '@tabler/icons-react'

import { TabsList, TabsTab } from '@/components/ui/tabs'
export const LEAVE_TABS: {
  value: LeaveRequestType
  label: string
  shortLabel: string
  icon: typeof IconStethoscope
}[] = [
  {
    value: 'sick_leave',
    label: 'Sick Leave',
    shortLabel: 'Sick',
    icon: IconStethoscope,
  },
  {
    value: 'early_out',
    label: 'Early Leave',
    shortLabel: 'Early',
    icon: IconLogout,
  },
  {
    value: 'late_arrival',
    label: 'Late Arrival',
    shortLabel: 'Late',
    icon: IconClock,
  },
]

export function LeaveTypeTabs() {
  return (
    <TabsList className="grid h-auto grid-cols-3 gap-1 p-1">
      {LEAVE_TABS.map(({ value, label, shortLabel, icon: Icon }) => (
        <TabsTab
          key={value}
          value={value}
          title={label}
          className="flex-col gap-1 px-2 py-2.5 sm:flex-row sm:gap-2"
        >
          <Icon className="size-4" />
          <span className="text-xs sm:hidden">{shortLabel}</span>
          <span className="hidden text-sm sm:inline">{label}</span>
        </TabsTab>
      ))}
    </TabsList>
  )
}
