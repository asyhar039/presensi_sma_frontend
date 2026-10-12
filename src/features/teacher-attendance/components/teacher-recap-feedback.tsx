import { IconAlertCircle, IconInbox } from '@tabler/icons-react'

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

type FeedbackAction = {
  label: string
  onClick: () => void
}

type TeacherRecapErrorProps = {
  title?: string
  message: string
  action?: FeedbackAction
}

export function TeacherRecapError({
  title = 'Something went wrong',
  message,
  action,
}: TeacherRecapErrorProps) {
  return (
    <Card>
      <CardContent className="py-6">
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <IconAlertCircle />
            </EmptyMedia>
            <EmptyTitle>{title}</EmptyTitle>
            <EmptyDescription>{message}</EmptyDescription>
          </EmptyHeader>
          {action && (
            <EmptyContent>
              <Button onClick={action.onClick} variant="outline">
                {action.label}
              </Button>
            </EmptyContent>
          )}
        </Empty>
      </CardContent>
    </Card>
  )
}

type TeacherRecapEmptyProps = {
  title: string
  message: string
  action?: FeedbackAction
}

export function TeacherRecapEmpty({
  title,
  message,
  action,
}: TeacherRecapEmptyProps) {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <IconInbox />
        </EmptyMedia>
        <EmptyTitle>{title}</EmptyTitle>
        <EmptyDescription>{message}</EmptyDescription>
      </EmptyHeader>
      {action && (
        <EmptyContent>
          <Button onClick={action.onClick}>{action.label}</Button>
        </EmptyContent>
      )}
    </Empty>
  )
}

export function TeacherPageSkeleton() {
  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex flex-col gap-1">
        <Skeleton className="h-7 w-56" />
        <Skeleton className="h-4 w-80" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-24 w-full" />
        ))}
      </div>
      <Card>
        <CardContent className="flex flex-col gap-4 pt-6">
          <div className="flex flex-col gap-2 sm:flex-row">
            <Skeleton className="h-9 w-full sm:w-64" />
            <Skeleton className="h-9 w-full sm:w-48" />
            <Skeleton className="h-9 w-full sm:w-40" />
          </div>
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </CardContent>
      </Card>
    </div>
  )
}

export function TeacherCalendarSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-7 gap-2">
        {Array.from({ length: 7 }).map((_, i) => (
          <Skeleton key={i} className="h-4 w-full" />
        ))}
      </div>
      <div className="grid grid-cols-7 gap-2">
        {Array.from({ length: 35 }).map((_, i) => (
          <Skeleton key={i} className="h-20 w-full sm:h-24" />
        ))}
      </div>
    </div>
  )
}
