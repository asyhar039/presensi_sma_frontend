import { IconMenu2 } from '@tabler/icons-react'

import { Logo } from '@/components/composite/logo'
import { ThemeSwitcher } from '@/components/composite/theme-switcher'
import { Button } from '@/components/ui/button'

type DashboardHeaderProps = {
  onMenuClick: () => void
}

export function DashboardHeader({ onMenuClick }: DashboardHeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex lg:hidden items-center gap-3 border-b border-border bg-background/80 px-4 py-2 backdrop-blur-sm lg:px-6">
      <Button
        variant="ghost"
        size="icon"
        onClick={onMenuClick}
        className="lg:hidden"
        aria-label="Open navigation menu"
      >
        <IconMenu2 className="size-5" />
      </Button>
      <div className="min-w-0 flex-1 h-full flex items-center">
        <Logo />
      </div>
      <div className="flex items-center gap-2">
        <ThemeSwitcher className="size-8" />
      </div>
    </header>
  )
}
