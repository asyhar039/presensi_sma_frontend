import {
  IconChevronUp,
  IconLayoutDashboard,
  IconLogout,
  IconMoon,
  IconSun,
} from '@tabler/icons-react'
import { useNavigate } from '@tanstack/react-router'
import { toast } from 'sonner'
import { useShallow } from 'zustand/shallow'

import { UserAvatar } from '@/components/composite/user-avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Typography } from '@/components/ui/typography'
import { THEME } from '@/constants/app'
import { useAuth } from '@/context/auth-context'
import { cn } from '@/lib/class-name'
import { useConfirmationStore } from '@/stores/confirmation-store'
import { useThemeStore } from '@/stores/theme-store'
import { delay } from '@/utils/time'

type DashboardUserMenuProps = {
  name: string
  identityNumber: string
  className?: string
}

export function DashboardUserMenu({
  name,
  identityNumber,
  className,
}: DashboardUserMenuProps) {
  const { logout } = useAuth()
  const navigate = useNavigate()

  const confirm = useConfirmationStore((state) => state.show)
  const [theme, toggleTheme] = useThemeStore(
    useShallow((state) => [state.theme, state.toggle]),
  )

  const isDark = theme === THEME.DARK
  const ThemeIcon = isDark ? IconSun : IconMoon

  const handleLogout = async () => {
    confirm({
      icon: IconLogout,
      title: 'Confirm Logout',
      description: 'Are you sure you want to log out?',
      actionLabel: 'Log out',
      actionVariant: 'destructive',
      cancelLabel: 'Cancel',
      onAction: async (props) => {
        props.close()
        await logout()
        await delay(100)
        toast.success('Logged out successfully')
        await navigate({ to: '/login', replace: true })
      },
    })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          'w-full rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-ring',
          className,
        )}
      >
        <div className="flex w-full items-center gap-3 rounded-xl border border-border bg-card p-2.5 text-left transition-colors hover:bg-muted/60">
          <UserAvatar name={name} className="size-9 shrink-0" />
          <div className="min-w-0 flex-1 space-y-1">
            <Typography variant="small" className="block truncate">
              {name}
            </Typography>
            <Typography variant="muted" className="block truncate text-xs">
              {identityNumber}
            </Typography>
          </div>
          <IconChevronUp className="size-4 shrink-0 text-muted-foreground" />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        side="top"
        sideOffset={8}
        className="w-64"
      >
        <DropdownMenuGroup>
          <DropdownMenuLabel>
            <div className="flex items-center gap-3">
              <UserAvatar name={name} className="size-9" />
              <div className="min-w-0 flex-1 space-y-1">
                <Typography variant="small" className="block truncate">
                  {name}
                </Typography>
                <Typography variant="muted" className="block truncate text-xs">
                  {identityNumber}
                </Typography>
              </div>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => void navigate({ to: '/dashboard' })}
            className="cursor-pointer"
          >
            <IconLayoutDashboard />
            Dashboard
          </DropdownMenuItem>
          <DropdownMenuItem onClick={toggleTheme} className="cursor-pointer">
            <ThemeIcon />
            {isDark ? 'Change to Light mode' : 'Change to Dark mode'}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            variant="destructive"
            className="cursor-pointer"
            onClick={() => void handleLogout()}
          >
            <IconLogout />
            Log out
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
