import { IconAlertCircle, IconInbox, IconSchool } from '@tabler/icons-react'

import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import {
  PermitEmpty,
  PermitError,
} from '@/features/student-permits/components/permit-feedback'

type HomeroomSkeletonProps = {
  rows?: number
}

export function HomeroomTableSkeleton({ rows = 5 }: HomeroomSkeletonProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2 sm:flex-row">
        <Skeleton className="h-9 w-full sm:w-64" />
        <Skeleton className="h-9 w-full sm:w-44" />
        <Skeleton className="h-9 w-full sm:w-44" />
      </div>
      <div className="overflow-hidden rounded-lg border">
        <div className="grid grid-cols-4 gap-3 border-b bg-muted/50 p-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-4 w-full" />
          ))}
        </div>
        {Array.from({ length: rows }).map((_, i) => (
          <div
            key={i}
            className="grid grid-cols-4 gap-3 border-b p-3 last:border-0"
          >
            {Array.from({ length: 4 }).map((_, j) => (
              <Skeleton key={j} className="h-4 w-full" />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

export function HomeroomHeaderSkeleton() {
  return (
    <div className="flex flex-col gap-1">
      <Skeleton className="h-7 w-56" />
      <Skeleton className="h-4 w-80" />
    </div>
  )
}

type HomeroomPageSkeletonProps = {
  rows?: number
}

export function HomeroomPageSkeleton({ rows }: HomeroomPageSkeletonProps) {
  return (
    <div className="flex w-full flex-col gap-6">
      <HomeroomHeaderSkeleton />
      <Card>
        <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-5 w-24" />
        </CardHeader>
        <CardContent>
          <HomeroomTableSkeleton rows={rows} />
        </CardContent>
      </Card>
    </div>
  )
}

type NotHomeroomWarningProps = {
  className?: string
}

export function NotHomeroomWarning({ className }: NotHomeroomWarningProps) {
  return (
    <Card className={className}>
      <CardContent className="flex flex-col items-center gap-2 py-8 text-center sm:flex-row sm:text-left">
        <span className="rounded-full bg-muted p-2.5 text-muted-foreground">
          <IconSchool className="size-5" />
        </span>
        <div className="flex flex-col gap-1">
          <p className="font-semibold">
            You are not assigned as a homeroom teacher
          </p>
          <p className="text-sm text-muted-foreground">
            Leave requests for your homeroom class will appear here once you are
            assigned to a class in the active academic year. Please contact an
            administrator if you believe this is a mistake.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

type HomeroomErrorProps = {
  message: string
  onRetry: () => void
}

export function HomeroomError({ message, onRetry }: HomeroomErrorProps) {
  return (
    <PermitError
      title="Failed to load homeroom data"
      message={message}
      action={{ label: 'Try again', onClick: onRetry }}
    />
  )
}

type HomeroomEmptyProps = {
  title?: string
  message?: string
}

export function HomeroomEmpty({
  title = 'No leave requests found',
  message = 'There are no leave requests from your homeroom class yet.',
}: HomeroomEmptyProps) {
  return <PermitEmpty title={title} message={message} />
}

export { IconAlertCircle, IconInbox }
