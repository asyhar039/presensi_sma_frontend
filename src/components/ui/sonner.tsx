import {
  IconAlertOctagon,
  IconAlertTriangle,
  IconCircleCheck,
  IconInfoCircle,
  IconLoader,
} from '@tabler/icons-react'
import { Toaster as Sonner, type ToasterProps } from 'sonner'

import { useThemeStore } from '@/stores/theme-store'

const ICONS = {
  success: <IconCircleCheck className="size-5" />,
  info: <IconInfoCircle className="size-5" />,
  warning: <IconAlertTriangle className="size-5" />,
  error: <IconAlertOctagon className="size-5" />,
  loading: <IconLoader className="size-5 animate-spin" />,
} as const

export function Toaster(props: ToasterProps) {
  const theme = useThemeStore((s) => s.theme)

  return (
    <Sonner
      theme={theme as ToasterProps['theme']}
      className="toaster group"
      icons={ICONS}
      style={
        {
          '--normal-bg': 'var(--popover)',
          '--normal-text': 'var(--popover-foreground)',
          '--normal-border': 'var(--border)',
          '--border-radius': 'var(--radius)',
        } as React.CSSProperties
      }
      {...props}
    />
  )
}
