import iconSIP from '@/assets/icon_SIP.png'
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
      <img
        src={iconSIP}
        alt="SIP Apps Logo"
        className={cn('size-8 object-contain', iconClassName)}
        aria-hidden="true"
      />
      {showText && (
        <span
          className={cn('text-lg font-semibold tracking-tight', textClassName)}
        >
          SIP Apps
        </span>
      )}
    </div>
  )
}

export { Logo }
