import {
  IconAlertTriangle,
  IconDatabaseOff,
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

interface PageHeadingProps {
  title: string
  description: string
}

export function TeacherStudentHeading({
  title,
  description,
}: PageHeadingProps) {
  return (
    <div className="flex flex-col gap-1">
      <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  )
}

export function TeacherStudentSkeleton() {
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

interface TeacherStudentErrorProps {
  message: string
  onRetry: () => void
}

export function TeacherStudentError({
  message,
  onRetry,
}: TeacherStudentErrorProps) {
  return (
    <div className="flex w-full flex-col gap-6">
      <TeacherStudentHeading
        title="Students"
        description="Manage and monitor students in your homeroom class."
      />
      <Card>
        <CardContent>
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <IconDatabaseOff />
              </EmptyMedia>
              <EmptyTitle>Failed to load homeroom data</EmptyTitle>
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

export function NoHomeroomWarning() {
  return (
    <div className="flex w-full flex-col gap-6">
      <TeacherStudentHeading
        title="Students"
        description="Manage and monitor students in your homeroom class."
      />
      <Card>
        <CardContent>
          <Empty className="border-0 bg-transparent p-8">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <IconAlertTriangle />
              </EmptyMedia>
              <EmptyTitle>You are not a homeroom teacher yet</EmptyTitle>
              <EmptyDescription>
                You have not been assigned as a homeroom teacher for the active
                academic year. Please contact the school admin.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        </CardContent>
      </Card>
    </div>
  )
}
