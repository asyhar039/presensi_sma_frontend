import {
  IconAlertTriangle,
  IconClock,
  IconShieldCheck,
} from '@tabler/icons-react'

import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

interface DutyStatusCardProps {
  isLoading: boolean
  isError: boolean
  onRetry: () => void
  status?: {
    has_duty_teacher: boolean
    is_active: string
    duty_teacher: { day: string; start_time: string; end_time: string } | null
  }
}

export function DutyStatusSkeleton() {
  return (
    <Card>
      <CardContent className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <Skeleton className="h-5 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Skeleton className="h-9 w-28" />
      </CardContent>
    </Card>
  )
}

export function DutyStatusCard({
  isLoading,
  isError,
  onRetry,
  status,
}: DutyStatusCardProps) {
  if (isLoading) return <DutyStatusSkeleton />
  if (isError || !status) {
    return (
      <Card className="border-destructive/50">
        <CardContent className="flex flex-wrap items-center gap-2 text-sm">
          <span className="font-semibold">Failed to load duty status.</span>
          <span className="text-muted-foreground">
            Could not check whether you are on duty today.
          </span>
          <button
            type="button"
            onClick={onRetry}
            className="underline underline-offset-2 font-medium"
          >
            Try again
          </button>
        </CardContent>
      </Card>
    )
  }

  const onDuty = status.has_duty_teacher
  const inside =
    String(status.is_active).toLowerCase() === 'true' ||
    String(status.is_active).toLowerCase() === 'active' ||
    status.is_active === '1'
  const slot = status.duty_teacher

  if (!onDuty) {
    return (
      <Card className="border-yellow-500/40">
        <CardContent className="flex items-start gap-3">
          <span className="rounded-lg bg-yellow-100 p-2 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300">
            <IconAlertTriangle className="size-5" />
          </span>
          <div>
            <p className="font-semibold">You are not on duty today</p>
            <p className="text-sm text-muted-foreground">
              Only the assigned duty teacher can approve early-out and
              late-arrival requests. The list below is read-only for you.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={inside ? 'border-green-500/40' : undefined}>
      <CardContent className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <span
            className={`mt-0.5 rounded-lg p-2 ${inside ? 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300' : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300'}`}
          >
            {inside ? (
              <IconShieldCheck className="size-5" />
            ) : (
              <IconClock className="size-5" />
            )}
          </span>
          <div>
            <p className="font-semibold">
              {inside
                ? 'You are on duty now'
                : 'You are the duty teacher, outside your slot'}
            </p>
            <p className="text-sm text-muted-foreground">
              {slot
                ? `${slot.day} • ${slot.start_time} – ${slot.end_time}`
                : 'No slot information for today.'}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
