import { IconArrowLeft, IconPencil, IconSearch } from '@tabler/icons-react'
import { useNavigate, useParams } from '@tanstack/react-router'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import { Skeleton } from '@/components/ui/skeleton'
import { DATE_FORMAT } from '@/constants/app'
import { formatAcademicLabel } from '@/features/academic-years/components/academic-year-columns'
import { ClassroomDialog } from '@/features/classrooms/components/classroom-dialog'
import {
  ClassroomProvider,
  useClassroomStore,
} from '@/features/classrooms/components/classroom-store'
import { ClassroomStudentsSection } from '@/features/classrooms/components/classroom-students-section'
import { useClassroomDetail } from '@/features/classrooms/hooks/use-classroom-detail'
import { formatDate } from '@/utils/datetime'

type ClassroomInfoProps = { name: string; label: string; value: string }

function ClassroomInfo({ name, label, value }: ClassroomInfoProps) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-sm font-medium" data-slot={name}>
        {value}
      </p>
    </div>
  )
}

function ClassroomDetailSkeleton() {
  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-9 w-36" />
          <Skeleton className="h-8 w-56" />
          <Skeleton className="h-4 w-32" />
        </div>
        <Skeleton className="h-9 w-full sm:w-36" />
      </div>
      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-48" />
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-28" />
          <Skeleton className="h-4 w-52" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-24 w-full" />
        </CardContent>
      </Card>
    </div>
  )
}

type ClassroomDetailErrorProps = { onBack: () => void; onRetry: () => void }

function ClassroomDetailError({ onBack, onRetry }: ClassroomDetailErrorProps) {
  return (
    <div className="flex flex-col gap-4">
      <Button variant="ghost" onClick={onBack} className="w-fit">
        <IconArrowLeft className="size-4" />
        <span>Back</span>
      </Button>
      <Empty className="min-h-[50vh]">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <IconSearch />
          </EmptyMedia>
          <EmptyTitle>Classroom not found</EmptyTitle>
          <EmptyDescription>
            This classroom could not be loaded. It may have been deleted.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button variant="outline" onClick={onRetry}>
            Try again
          </Button>
        </EmptyContent>
      </Empty>
    </div>
  )
}

function toEditPayload(
  classroom: NonNullable<ReturnType<typeof useClassroomDetail>['data']>,
) {
  return {
    id: classroom.id,
    name: classroom.name,
    academic_year: classroom.academic_year
      ? {
          label: formatAcademicLabel(classroom.academic_year),
          value: classroom.academic_year.id,
        }
      : null,
    homeroom_teacher: classroom.homeroom_teacher
      ? {
          id: classroom.homeroom_teacher.id,
          name: classroom.homeroom_teacher.user.name,
          email: classroom.homeroom_teacher.user.email,
        }
      : null,
    students_count: classroom.students_count,
    created_at: classroom.created_at,
    updated_at: classroom.updated_at,
  }
}

function ClassroomDetailContent() {
  const navigate = useNavigate()
  const { classroomId } = useParams({
    from: '/dashboard/classrooms/$classroomId',
  })
  const openEdit = useClassroomStore((state) => state.openEdit)
  const detailQuery = useClassroomDetail(Number(classroomId))
  const back = () => navigate({ to: '/dashboard/classrooms' })

  if (detailQuery.isLoading) return <ClassroomDetailSkeleton />
  if (detailQuery.isError || !detailQuery.data) {
    return (
      <ClassroomDetailError
        onBack={back}
        onRetry={() => detailQuery.refetch()}
      />
    )
  }

  const classroom = detailQuery.data
  const homeroom = classroom.homeroom_teacher

  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-1">
          <Button variant="ghost" onClick={back} className="w-fit px-0">
            <IconArrowLeft className="size-4" />
            <span>Back to classrooms</span>
          </Button>
          <h1 className="text-2xl font-bold tracking-tight">
            {classroom.name}
          </h1>
        </div>
        <Button
          variant="outline"
          onClick={() => openEdit(toEditPayload(classroom))}
          className="w-full sm:w-auto"
        >
          <IconPencil />
          <span>Edit classroom</span>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Classroom Info</CardTitle>
          <CardDescription>Basic classroom information.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <ClassroomInfo name="name" label="Name" value={classroom.name} />
            <ClassroomInfo
              name="academic-year"
              label="Academic Year"
              value={
                classroom.academic_year
                  ? formatAcademicLabel(classroom.academic_year)
                  : '-'
              }
            />
            <ClassroomInfo
              name="homeroom"
              label="Homeroom Teacher"
              value={homeroom ? homeroom.user.name : 'Not assigned'}
            />
            <ClassroomInfo
              name="students"
              label="Students"
              value={String(classroom.students_count)}
            />
            <ClassroomInfo
              name="created"
              label="Created At"
              value={formatDate(classroom.created_at, DATE_FORMAT.DATE)}
            />
            <ClassroomInfo
              name="updated"
              label="Updated At"
              value={formatDate(classroom.updated_at, DATE_FORMAT.DATE)}
            />
          </div>
        </CardContent>
      </Card>

      <ClassroomStudentsSection classroomId={classroom.id} />
      <ClassroomDialog />
    </div>
  )
}

export function ClassroomDetailView() {
  return (
    <ClassroomProvider>
      <ClassroomDetailContent />
    </ClassroomProvider>
  )
}
