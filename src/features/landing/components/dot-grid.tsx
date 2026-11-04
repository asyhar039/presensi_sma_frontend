import { cn } from '@/lib/class-name'

interface DotGridProps {
  className?: string
}

export function DotGrid({ className }: DotGridProps) {
  return (
    <div
      className={cn(
        'grid grid-cols-8 gap-3 opacity-30 select-none pointer-events-none',
        className,
      )}
    >
      {Array.from({ length: 32 }).map((_, i) => (
        <span key={`dot-${i}`} className="size-1.5 rounded-full bg-cyan-300" />
      ))}
    </div>
  )
}
