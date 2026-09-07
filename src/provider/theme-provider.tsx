import { THEME } from '@/constants/app'
import { useMediaQuery } from '@/hooks/use-media-query'
import { useUpdateEffect } from '@/hooks/use-update-effect'
import { useThemeStore } from '@/stores/theme-store'

export function ThemeProvider() {
  const updateTheme = useThemeStore((s) => s.set)
  const themeChanged = useMediaQuery('(prefers-color-scheme: dark)')

  useUpdateEffect(() => {
    updateTheme(themeChanged ? THEME.DARK : THEME.LIGHT)
  }, [themeChanged])

  return null
}
