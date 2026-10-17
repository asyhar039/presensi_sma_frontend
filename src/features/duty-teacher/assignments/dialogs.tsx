import { useQuery } from '@tanstack/react-query'

import { ResponsiveDialog } from '@/components/composite/responsive-dialog'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { DATE_FORMAT } from '@/constants/app'
import { formatDutyDay } from '@/features/duty-teacher/assignments/columns'
import { DutyAssignmentForm } from '@/features/duty-teacher/assignments/dialog-form'
import { dutyAssignmentDetailQueryOptions } from '@/features/duty-teacher/assignments/query'
import { useDutyAssignmentStore } from '@/features/duty-teacher/assignments/store'
import { formatDate } from '@/utils/datetime'
import { getErrorMessage } from '@/utils/error'

const DIALOG_COPY = {
  create: {
    title: 'Create duty teacher',
    description: 'Assign a teacher to a weekly duty slot.',
  },
  edit: {
    title: 'Edit duty teacher',
    description: 'Update the duty teacher assignment.',
  },
  detail: {
    title: 'Duty teacher detail',
    description: 'Assignment details for this duty slot.',
  },
} as const

type DetailProps = { id: number }

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-medium break-all sm:text-right">
        {value}
      </span>
    </div>
  )
}

function DutyAssignmentDetail({ id }: DetailProps) {
  const query = useQuery(dutyAssignmentDetailQueryOptions(id))

  if (query.isPending) {
    return (
      <div className="flex flex-col gap-3">
        {Array.from({ length: 5 }).map((_, index) => (
          <Skeleton key={index} className="h-5 w-full" />
        ))}
      </div>
    )
  }

  if (query.isError || !query.data) {
    return (
      <p className="text-sm text-destructive">
        {getErrorMessage(query.error, 'Failed to load duty teacher detail.')}
      </p>
    )
  }

  const item = query.data
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="secondary" className="capitalize">
          {formatDutyDay(item.day)}
        </Badge>
        <Badge variant="outline" className="tabular-nums">
          {item.start_time} – {item.end_time}
        </Badge>
      </div>
      <DetailRow label="Teacher" value={item.teacher.name} />
      <DetailRow label="Email" value={item.teacher.email} />
      <DetailRow label="Start Time" value={item.start_time} />
      <DetailRow label="End Time" value={item.end_time} />
      <DetailRow
        label="Created At"
        value={formatDate(item.created_at, DATE_FORMAT.DATE_TIME)}
      />
      <DetailRow
        label="Updated At"
        value={formatDate(item.updated_at, DATE_FORMAT.DATE_TIME)}
      />
    </div>
  )
}

export function DutyAssignmentDialog() {
  const selected = useDutyAssignmentStore((state) => state.selected)
  const mode = useDutyAssignmentStore((state) => state.mode)
  const isDialogOpen = useDutyAssignmentStore((state) => state.isDialogOpen)
  const closeDialog = useDutyAssignmentStore((state) => state.closeDialog)
  const settleDialog = useDutyAssignmentStore((state) => state.settleDialog)
  const copy = mode ? DIALOG_COPY[mode] : DIALOG_COPY.create

  return (
    <ResponsiveDialog
      title={copy.title}
      description={copy.description}
      isOpen={isDialogOpen}
      onIsOpenChange={(open) => {
        if (!open) closeDialog()
      }}
      onIsOpenChangeComplete={(open) => {
        if (!open) settleDialog()
      }}
    >
      {mode === 'detail' && selected ? (
        <DutyAssignmentDetail key={selected.id} id={selected.id} />
      ) : mode === 'edit' ? (
        <DutyAssignmentForm key={selected?.id ?? 'edit'} initial={selected} />
      ) : (
        <DutyAssignmentForm key="create" initial={null} />
      )}
    </ResponsiveDialog>
  )
}
