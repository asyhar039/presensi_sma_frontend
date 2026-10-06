import type { IStudent } from '@/features/students/types/student.types'

import { IconDatabaseOff, IconReload } from '@tabler/icons-react'
import { useQuery } from '@tanstack/react-query'

import { ResponsiveDialog } from '@/components/composite/responsive-dialog'
import { Button } from '@/components/ui/button'
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
import { useStudentStore } from '@/features/students/components/student-store'
import { homeroomStudentDetailQueryOptions } from '@/features/students/lib/homeroom-query-options'
import { formatDate } from '@/utils/datetime'
import { getErrorMessage } from '@/utils/error'

interface DetailRowProps {
  label: string
  value: string
}

function DetailRow({ label, value }: DetailRowProps) {
  return (
    <div className="flex flex-col gap-0.5 py-2 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-medium break-words sm:text-right">
        {value}
      </span>
    </div>
  )
}

interface TeacherStudentDetailProps {
  item: IStudent
}

function TeacherStudentDetail({ item }: TeacherStudentDetailProps) {
  const detailQuery = useQuery(homeroomStudentDetailQueryOptions(item.id))
  const data = detailQuery.data ?? item

  if (detailQuery.isLoading) {
    return (
      <div className="flex flex-col gap-2" role="status" aria-busy="true">
        {Array.from({ length: 7 }).map((_, index) => (
          <Skeleton key={index} className="h-8 w-full" />
        ))}
      </div>
    )
  }

  if (detailQuery.isError) {
    return (
      <Empty className="border-0 p-6">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <IconDatabaseOff />
          </EmptyMedia>
          <EmptyTitle>Failed to load student details</EmptyTitle>
          <EmptyDescription>
            {getErrorMessage(detailQuery.error, 'Something went wrong.')}
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button
            variant="outline"
            size="sm"
            onClick={() => detailQuery.refetch()}
          >
            <IconReload />
            <span>Try again</span>
          </Button>
        </EmptyContent>
      </Empty>
    )
  }

  return (
    <dl className="divide-y divide-border rounded-md border border-border px-4">
      <DetailRow label="Identity Number" value={data.user.identity_number} />
      <DetailRow label="Name" value={data.user.name} />
      <DetailRow label="Email" value={data.user.email} />
      <DetailRow label="Phone Number" value={data.user.phone_number || '-'} />
      <DetailRow label="Gender" value={data.gender.label || data.gender.key} />
      <DetailRow label="Address" value={data.address || '-'} />
      <DetailRow label="Status" value={data.status.label || data.status.key} />
      <DetailRow
        label="Created At"
        value={formatDate(data.created_at, DATE_FORMAT.DATE_TIME)}
      />
      <DetailRow
        label="Updated At"
        value={formatDate(data.updated_at, DATE_FORMAT.DATE_TIME)}
      />
    </dl>
  )
}

export function TeacherStudentDetailDialog() {
  const selected = useStudentStore((state) => state.selected)
  const mode = useStudentStore((state) => state.mode)
  const isDialogOpen = useStudentStore((state) => state.isDialogOpen)
  const closeDialog = useStudentStore((state) => state.closeDialog)

  if (mode !== 'view') return null

  return (
    <ResponsiveDialog
      title="Student Details"
      description="Profile and status of this student in your class."
      isOpen={isDialogOpen}
      onIsOpenChange={(open) => {
        if (!open) closeDialog()
      }}
    >
      {selected ? (
        <TeacherStudentDetail key={selected.id} item={selected} />
      ) : null}
    </ResponsiveDialog>
  )
}
