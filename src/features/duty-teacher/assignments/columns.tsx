import type { ColumnDef } from '@tanstack/react-table'
import type { DataTableFeatures } from '@/components/data-table/data-table'
import type { IDutyAssignment } from '@/features/duty-teacher/assignments/types'

import {
  IconDotsVertical,
  IconEye,
  IconPencil,
  IconTrash,
} from '@tabler/icons-react'
import { useMemo } from 'react'
import { toast } from 'sonner'

import {
  dataTableHeader,
  dataTableHeaderActions,
} from '@/components/data-table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { DATE_FORMAT } from '@/constants/app'
import { useDeleteDutyAssignment } from '@/features/duty-teacher/assignments/hooks'
import { useDutyAssignmentStore } from '@/features/duty-teacher/assignments/store'
import { useConfirmationStore } from '@/stores/confirmation-store'
import { formatDate } from '@/utils/datetime'
import { getErrorMessage } from '@/utils/error'

export function formatDutyDay(day: string) {
  if (!day) return '-'
  return day.charAt(0).toUpperCase() + day.slice(1).toLowerCase()
}

type DutyAssignmentActionsProps = { item: IDutyAssignment }

function DutyAssignmentActions({ item }: DutyAssignmentActionsProps) {
  const openEdit = useDutyAssignmentStore((state) => state.openEdit)
  const openDetail = useDutyAssignmentStore((state) => state.openDetail)
  const showConfirmation = useConfirmationStore((state) => state.show)
  const deleteMutation = useDeleteDutyAssignment()

  const handleDelete = () => {
    showConfirmation({
      icon: IconTrash,
      title: 'Delete duty teacher?',
      description: `This will permanently delete the ${formatDutyDay(item.day)} duty slot for "${item.teacher.name}". This action cannot be undone.`,
      actionLabel: 'Delete',
      actionVariant: 'destructive',
      onAction: async ({ close, loading }) => {
        loading(true)
        try {
          await deleteMutation.mutateAsync(item.id)
        } catch (error) {
          toast.error(getErrorMessage(error, 'Failed to delete duty teacher.'))
        } finally {
          loading(false)
          close()
        }
      },
    })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="ghost" size="icon-sm" aria-label="Open row actions">
            <IconDotsVertical />
          </Button>
        }
      />
      <DropdownMenuContent align="end" side="bottom">
        <DropdownMenuItem onClick={() => openDetail(item)}>
          <IconEye />
          <span>View detail</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => openEdit(item)}>
          <IconPencil />
          <span>Edit</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" onClick={handleDelete}>
          <IconTrash />
          <span>Delete</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export function useDutyAssignmentColumns(): ColumnDef<
  DataTableFeatures,
  IDutyAssignment,
  unknown
>[] {
  return useMemo<ColumnDef<DataTableFeatures, IDutyAssignment, unknown>[]>(
    () => [
      {
        accessorKey: 'teacher',
        header: dataTableHeader('Teacher'),
        enableSorting: false,
        cell: ({ row }) => (
          <div className="flex min-w-0 flex-col">
            <span className="truncate font-medium whitespace-nowrap">
              {row.original.teacher.name}
            </span>
            <span className="truncate text-xs text-muted-foreground">
              {row.original.teacher.email}
            </span>
          </div>
        ),
      },
      {
        accessorKey: 'day',
        header: dataTableHeader('Day'),
        cell: ({ row }) => (
          <Badge variant="secondary" className="capitalize">
            {formatDutyDay(row.original.day)}
          </Badge>
        ),
      },
      {
        id: 'slot',
        header: dataTableHeader('Time Slot'),
        enableSorting: false,
        cell: ({ row }) => (
          <span className="whitespace-nowrap tabular-nums">
            {row.original.start_time} – {row.original.end_time}
          </span>
        ),
      },
      {
        id: 'academic_year',
        header: dataTableHeader('Academic Year'),
        enableSorting: false,
        cell: ({ row }) => (
          <span className="whitespace-nowrap">
            {row.original.academic_year
              ? `${new Date(row.original.academic_year.odd_start_date).getFullYear()}/${new Date(row.original.academic_year.even_start_date).getFullYear()}`
              : '-'}
          </span>
        ),
      },
      {
        accessorKey: 'created_at',
        header: dataTableHeader('Created At'),
        cell: ({ row }) => (
          <span className="whitespace-nowrap text-muted-foreground">
            {formatDate(row.original.created_at, DATE_FORMAT.DATE)}
          </span>
        ),
      },
      {
        id: 'actions',
        header: dataTableHeaderActions,
        enableSorting: false,
        cell: ({ row }) => (
          <div className="flex justify-end">
            <DutyAssignmentActions item={row.original} />
          </div>
        ),
      },
    ],
    [],
  )
}
