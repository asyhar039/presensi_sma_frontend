import { IconMoon, IconSun } from '@tabler/icons-react'

import { Button } from '@/components/ui/button'
import { useThemeStore } from '@/stores/theme-store'

export function ThemeSwitcher() {
  const onToggle = useThemeStore((val) => val.toggle)

  return (
    <Button
      className="bg-background dark:bg-foreground dark:text-background dark:hover:bg-foreground dark:hover:text-primary size-9 cursor-pointer rounded-full dark:border-transparent"
      variant="outline"
      size="icon"
      onClick={onToggle}
    >
      <IconSun className="scale-0 rotate-90 transition-transform! duration-500 ease-in-out dark:scale-100 dark:rotate-0" />
      <IconMoon className="absolute scale-100 rotate-0 transition-transform! duration-500 ease-in-out dark:scale-0 dark:-rotate-90" />
      <span className="sr-only">Switch Theme</span>
    </Button>
  )
}
