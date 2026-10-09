import {
  IconAlertTriangle,
  IconDatabaseOff,
  IconReload,
  IconShieldCheck,
} from '@tabler/icons-react'

import { Badge } from '@/components/ui/badge'
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

interface DutyHeadingProps {
  title: string
  description: string
  badge?: string
}

export function DutyHeading({ title, description, badge }: DutyHeadingProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      {badge && (
        <Badge variant="secondary" className="w-fit gap-1">
          <IconShieldCheck className="size-4" />
          <span>{badge}</span>
        </Badge>
      )}
    </div>
  )
}

export function DutySkeleton() {
  return (
    <div className="flex w-full flex-col gap-6" aria-busy="true">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-72 max-w-full" />
        </div>
        <Skeleton className="h-6 w-32" />
      </div>
      <Card>
        <CardContent className="flex flex-col gap-3">
          <Skeleton className="h-10 w-full" />
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton key={index} className="h-12 w-full" />
          ))}
        </CardContent>
      </Card>
    </div>
  )
}

interface DutyErrorProps {
  message: string
  onRetry: () => void
}

export function DutyError({ message, onRetry }: DutyErrorProps) {
  return (
    <div className="flex w-full flex-col gap-6">
      <DutyHeading
        title="Duty Teacher"
        description="Review today's early-out and late-arrival requests."
      />
      <Card>
        <CardContent>
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <IconDatabaseOff />
              </EmptyMedia>
              <EmptyTitle>Failed to load duty status</EmptyTitle>
              <EmptyDescription>{message}</EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <Button variant="outline" size="sm" onClick={onRetry}>
                <IconReload />
                <span>Try again</span>
              </Button>
            </EmptyContent>
          </Empty>
        </CardContent>
      </Card>
    </div>
  )
}

export function NoDutyWarning() {
  return (
    <div className="flex w-full flex-col gap-6">
      <DutyHeading
        title="Duty Teacher"
        description="Review today's early-out and late-arrival requests."
      />
      <Card>
        <CardContent>
          <Empty className="border-0 bg-transparent p-8">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <IconAlertTriangle />
              </EmptyMedia>
              <EmptyTitle>You are not on duty today</EmptyTitle>
              <EmptyDescription>
                You have not been assigned as a duty teacher for the active
                academic year. Please contact the school admin.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        </CardContent>
      </Card>
    </div>
  )
}

interface OutsideSlotWarningProps {
  day?: string
  startTime?: string
  endTime?: string
}

export function OutsideSlotWarning({
  day,
  startTime,
  endTime,
}: OutsideSlotWarningProps) {
  const slot =
    day && startTime && endTime
      ? `${day.charAt(0).toUpperCase() + day.slice(1)} • ${startTime}–${endTime}`
      : undefined
  return (
    <div className="flex w-full flex-col gap-6">
      <DutyHeading
        title="Duty Teacher"
        description="Review today's early-out and late-arrival requests."
        badge={slot}
      />
      <Card>
        <CardContent>
          <Empty className="border-0 bg-transparent p-8">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <IconAlertTriangle />
              </EmptyMedia>
              <EmptyTitle>Outside your duty slot</EmptyTitle>
              <EmptyDescription>
                {slot
                  ? `Your duty slot today is ${slot}. The current time is outside your slot, so the request list is hidden.`
                  : 'The current time is outside your duty slot, so the request list is hidden.'}
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        </CardContent>
      </Card>
    </div>
  )
}
