import type {
  DashboardNavGroup,
  DashboardNavItem,
} from '@/constants/navigation'

import { Link, useLocation } from '@tanstack/react-router'

import { Logo } from '@/components/composite/logo'
import { Typography } from '@/components/ui/typography'
import { isActiveNavItem } from '@/constants/navigation'
import { cn } from '@/lib/class-name'
import { DashboardUserMenu } from './dashboard-user-menu'

type DashboardSidebarProps = {
  groups: DashboardNavGroup[]
  userName: string
  identityNumber: string
  onNavigate?: () => void
  className?: string
}

export function DashboardSidebar({
  groups,
  userName,
  identityNumber,
  onNavigate,
  className,
}: DashboardSidebarProps) {
  const { pathname } = useLocation()

  return (
    <div
      className={cn(
        'flex h-full flex-col bg-sidebar text-sidebar-foreground',
        className,
      )}
    >
      <div className="flex items-center px-5 pt-6 pb-2">
        <Link
          to="/dashboard"
          onClick={onNavigate}
          className="rounded-md outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring"
        >
          <Logo />
        </Link>
      </div>

      <nav
        aria-label="Dashboard"
        className="flex-1 space-y-6 overflow-y-auto px-3 py-4"
      >
        {groups.map((group) => (
          <section key={group.title} aria-label={group.title}>
            <Typography
              variant="muted"
              className="px-3 pb-2 text-xs font-medium tracking-wider uppercase"
            >
              {group.title}
            </Typography>
            <ul className="space-y-1">
              {group.items.map((item) => (
                <DashboardSidebarNavItem
                  key={item.title}
                  item={item}
                  isActive={isActiveNavItem(pathname, item.href)}
                  onNavigate={onNavigate}
                />
              ))}
            </ul>
          </section>
        ))}
      </nav>

      <div className="p-3">
        <DashboardUserMenu name={userName} identityNumber={identityNumber} />
      </div>
    </div>
  )
}

type DashboardSidebarNavItemProps = {
  item: DashboardNavItem
  isActive: boolean
  onNavigate?: () => void
}

function DashboardSidebarNavItem({
  item,
  isActive,
  onNavigate,
}: DashboardSidebarNavItemProps) {
  const Icon = item.icon

  return (
    <li>
      <Link
        to={item.href}
        onClick={onNavigate}
        aria-current={isActive ? 'page' : undefined}
        className={cn(
          'group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors outline-none',
          'focus-visible:ring-2 focus-visible:ring-sidebar-ring',
          isActive
            ? 'bg-sidebar-primary text-sidebar-primary-foreground shadow-xs'
            : 'text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
        )}
      >
        <Icon className="size-5 shrink-0" stroke={1.8} aria-hidden="true" />
        <Typography
          variant="small"
          className="flex-1 truncate font-medium text-inherit"
        >
          {item.title}
        </Typography>
      </Link>
    </li>
  )
}
