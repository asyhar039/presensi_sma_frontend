import type { LeaveRequestType } from '@/features/student-permits/types/permit.types'

import { IconClock, IconLogout, IconStethoscope } from '@tabler/icons-react'

import { TabsList, TabsTab } from '@/components/ui/tabs'
import { cn } from '@/lib/class-name'
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

interface LeaveTypeTabsProps {
  activeTab: LeaveRequestType
}

export function LeaveTypeTabs({ activeTab }: LeaveTypeTabsProps) {
  return (
    <TabsList className="grid h-auto grid-cols-3 gap-1 rounded-lg bg-muted/80 p-1">
      {LEAVE_TABS.map(({ value, label, shortLabel, icon: Icon }) => {
        const isActive = activeTab === value

        return (
          <TabsTab
            key={value}
            value={value}
            title={label}
            className={cn(
              'flex-1 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer flex items-center justify-center flex-col gap-1 sm:flex-row sm:gap-2 sm:text-sm text-xs',
              'text-slate-500 hover:text-slate-900 hover:bg-slate-200/60',
              isActive &&
                'bg-white text-emerald-700 font-semibold shadow-sm border border-slate-200/80 hover:bg-white hover:text-emerald-700',
            )}
          >
            <Icon className="size-4 shrink-0" />
            <span className="text-xs sm:hidden">{shortLabel}</span>
            <span className="hidden text-sm sm:inline">{label}</span>
          </TabsTab>
        )
      })}
    </TabsList>
  )
}
