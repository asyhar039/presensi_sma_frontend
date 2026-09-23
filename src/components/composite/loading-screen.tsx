import { Spinner } from '@/components/ui/spinner'
import { cn } from '@/lib/class-name'

interface LoadingScreenProps {
  type?: 'overlay' | 'background' | 'blur'
  message?: string
}

export function LoadingScreen({
  type = 'background',
  message,
}: LoadingScreenProps) {
  return (
    <div
      className={cn(
        'fixed inset-0 z-90 flex h-full min-h-screen w-full flex-col items-center justify-center gap-4',
        {
          'bg-white/70 dark:bg-black/70 supports-backdrop-filter:backdrop-blur-sm':
            type === 'blur',
          'bg-white/60 dark:bg-black/60': type === 'overlay',
          'bg-background': type === 'background',
        },
      )}
    >
      <Spinner className="size-12" />
      {message && (
        <p className="text-foreground text-center text-base">{message}</p>
      )}
    </div>
  )
}
