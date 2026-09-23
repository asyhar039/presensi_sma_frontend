import type { TablerIcon } from '@tabler/icons-react'

import {
  IconCalendar,
  IconCalendarHeart,
  IconMapPin,
} from '@tabler/icons-react'
import { Link, Outlet, useRouterState } from '@tanstack/react-router'

import { cn } from '@/lib/class-name'

type SettingsTab = {
  title: string
  href: string
  icon: TablerIcon
  exact?: boolean
}

const SETTINGS_TABS: SettingsTab[] = [
  {
    title: 'Schedule Clock',
    href: '/dashboard/settings',
    icon: IconCalendar,
    exact: true,
  },
  {
    title: 'Public Holidays',
    href: '/dashboard/settings/public-holidays',
    icon: IconCalendarHeart,
  },
  {
    title: 'School Zones',
    href: '/dashboard/settings/school-zones',
    icon: IconMapPin,
  },
]

export function SettingsView() {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  })

  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground">
          Configure schedule clocks, public holidays, and school zones.
        </p>
      </div>

      <nav
        aria-label="Settings pages"
        className="flex gap-1 overflow-x-auto rounded-xl border border-border bg-card p-1"
      >
        {SETTINGS_TABS.map((tab) => {
          const Icon = tab.icon
          const isActive = tab.exact
            ? pathname === tab.href
            : pathname.startsWith(tab.href)
          return (
            <Link
              key={tab.href}
              to={tab.href}
              className={cn(
                'flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm whitespace-nowrap transition-colors sm:flex-none sm:px-4',
                isActive
                  ? 'bg-primary font-medium text-primary-foreground shadow-xs'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground',
              )}
            >
              <Icon className="size-4" />
              {tab.title}
            </Link>
          )
        })}
      </nav>

      <Outlet />
    </div>
  )
}
