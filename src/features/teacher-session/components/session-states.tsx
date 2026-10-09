import {
  IconCalendarOff,
  IconDatabaseOff,
  IconQrcodeOff,
  IconReload,
} from '@tabler/icons-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import { Skeleton } from '@/components/ui/skeleton'

export function SessionHeading({ badge }: { badge?: string }) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Presence Session</h1>
        <p className="text-sm text-muted-foreground">
          Start the session, share the QR code, and watch the live feed.
        </p>
      </div>
      {badge && (
        <span className="w-fit rounded-md bg-muted px-2.5 py-1 text-xs font-medium">
          {badge}
        </span>
      )}
    </div>
  )
}

export function SessionSkeleton() {
  return (
    <div className="flex w-full flex-col gap-6" aria-busy="true">
      <div className="flex flex-col gap-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-72 max-w-full" />
      </div>
      <div className="grid gap-6 lg:grid-cols-12">
        <div className="space-y-6 lg:col-span-5">
          <Skeleton className="h-80 w-full" />
          <Skeleton className="h-40 w-full" />
        </div>
        <div className="space-y-6 lg:col-span-7">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    </div>
  )
}

function StateCard({
  icon,
  title,
  description,
  action,
}: {
  icon: React.ReactNode
  title: string
  description: string
  action?: React.ReactNode
}) {
  return (
    <div className="flex w-full flex-col gap-6">
      <SessionHeading />
      <Card>
        <CardContent>
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">{icon}</EmptyMedia>
              <EmptyTitle>{title}</EmptyTitle>
              <EmptyDescription>{description}</EmptyDescription>
            </EmptyHeader>
            {action && <EmptyContent>{action}</EmptyContent>}
          </Empty>
        </CardContent>
      </Card>
    </div>
  )
}

export function SessionError({
  message,
  onRetry,
}: {
  message: string
  onRetry: () => void
}) {
  return (
    <StateCard
      icon={<IconDatabaseOff />}
      title="Failed to load presence state"
      description={message}
      action={
        <Button variant="outline" size="sm" onClick={onRetry}>
          <IconReload />
          Try again
        </Button>
      }
    />
  )
}

export function NoScheduleWarning() {
  return (
    <StateCard
      icon={<IconCalendarOff />}
      title="No class scheduled now"
      description="There is no active teaching slot at this time. Check your schedule and come back during class hours."
    />
  )
}

export function OutsideSlotWarning({
  startTime,
  endTime,
}: {
  startTime?: string
  endTime?: string
}) {
  return (
    <StateCard
      icon={<IconQrcodeOff />}
      title="Outside class time"
      description={
        startTime && endTime
          ? `This slot runs ${startTime}–${endTime}. The session controls unlock during that window.`
          : 'The session controls unlock during the class window.'
      }
    />
  )
}
