import { IconQrcode } from '@tabler/icons-react'

import { cn } from '@/lib/class-name'

type LogoProps = {
  className?: string
  iconClassName?: string
  textClassName?: string
  showText?: boolean
}

function Logo({
  className,
  iconClassName,
  textClassName,
  showText = true,
}: LogoProps) {
  return (
    <div
      className={cn(
        'inline-flex items-center gap-2 text-primary dark:text-primary-foreground select-none',
        className,
      )}
    >
      <IconQrcode
        className={cn('size-6', iconClassName)}
        stroke={2}
        aria-hidden="true"
      />
      {showText && (
        <span
          className={cn('text-lg font-semibold tracking-tight', textClassName)}
        >
          Attendance Apps
        </span>
      )}
    </div>
  )
}

export { Logo }
