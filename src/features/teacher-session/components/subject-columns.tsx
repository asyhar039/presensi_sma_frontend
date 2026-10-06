import type { ColumnDef } from '@tanstack/react-table'
import type { DataTableFeatures } from '@/components/data-table/data-table'
import type { ISubjectLeaveRow } from '@/features/teacher-session/types/teacher-session.types'

import { IconDotsVertical, IconEye } from '@tabler/icons-react'
import { useMemo } from 'react'

import {
  dataTableHeader,
  dataTableHeaderActions,
} from '@/components/data-table'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  DutyStatusBadge,
  DutyTypeBadge,
} from '@/features/duty-teacher/components/duty-badges'

type SubjectColumnsProps = { onViewDetail: (id: number) => void }

function RowActions({
  row,
  onViewDetail,
}: {
  row: ISubjectLeaveRow
  onViewDetail: (id: number) => void
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="ghost" size="icon-sm" aria-label="Open row actions">
            <IconDotsVertical />
          </Button>
        }
      />
      <DropdownMenuContent align="end" className="w-44">
        <DropdownMenuItem onClick={() => onViewDetail(row.leave_request.id)}>
          <IconEye />
          <span>View detail</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export function useSubjectColumns({
  onViewDetail,
}: SubjectColumnsProps): ColumnDef<
  DataTableFeatures,
  ISubjectLeaveRow,
  unknown
>[] {
  return useMemo(
    () => [
      {
        id: 'student',
        accessorFn: (row) => row.student.name,
        header: dataTableHeader('Student'),
        cell: ({ row }) => (
          <div className="min-w-0">
            <p className="truncate font-medium">{row.original.student.name}</p>
            <p className="text-xs text-muted-foreground">
              NIS {row.original.student.identity_number}
            </p>
          </div>
        ),
      },
      {
        id: 'class',
        accessorFn: (row) => row.class.name,
        header: dataTableHeader('Class'),
        cell: ({ row }) => (
          <span className="whitespace-nowrap">{row.original.class.name}</span>
        ),
      },
      {
        id: 'type',
        accessorFn: (row) => row.leave_request.type.label,
        header: dataTableHeader('Type'),
        cell: ({ row }) => (
          <DutyTypeBadge
            typeKey={row.original.leave_request.type.key}
            label={row.original.leave_request.type.label}
          />
        ),
      },
      {
        id: 'date',
        accessorFn: (row) => row.leave_request.date,
        header: dataTableHeader('Date'),
        cell: ({ row }) => (
          <span className="whitespace-nowrap text-sm">
            {row.original.leave_request.date}
          </span>
        ),
      },
      {
        id: 'step',
        accessorFn: (row) => row.leave_request.current_step,
        header: dataTableHeader('Step'),
        cell: ({ row }) => (
          <span className="text-sm text-muted-foreground capitalize">
            {row.original.leave_request.current_step.replaceAll('_', ' ')}
          </span>
        ),
      },
      {
        id: 'status',
        accessorFn: (row) => row.leave_request.status.key,
        header: dataTableHeader('Status'),
        cell: ({ row }) => (
          <DutyStatusBadge statusKey={row.original.leave_request.status.key} />
        ),
      },
      {
        id: 'actions',
        header: dataTableHeaderActions,
        cell: ({ row }) => (
          <RowActions row={row.original} onViewDetail={onViewDetail} />
        ),
      },
    ],
    [onViewDetail],
  )
}
