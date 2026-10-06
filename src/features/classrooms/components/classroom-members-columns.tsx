import type { ColumnDef } from '@tanstack/react-table'
import type { DataTableFeatures } from '@/components/data-table/data-table'
import type { IClassroomMember } from '@/features/classrooms/types/classroom.types'

import { IconTrash } from '@tabler/icons-react'
import { useMemo } from 'react'
import { toast } from 'sonner'

import {
  dataTableHeader,
  dataTableHeaderActions,
} from '@/components/data-table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { DATE_FORMAT } from '@/constants/app'
import { useRemoveClassroomMember } from '@/features/classrooms/hooks/use-remove-classroom-member'
import { useConfirmationStore } from '@/stores/confirmation-store'
import { formatDate } from '@/utils/datetime'
import { getErrorMessage } from '@/utils/error'

type ClassroomMemberRemoveProps = {
  classroomId: number
  item: IClassroomMember
}

function ClassroomMemberRemove({
  classroomId,
  item,
}: ClassroomMemberRemoveProps) {
  const showConfirmation = useConfirmationStore((state) => state.show)
  const removeMutation = useRemoveClassroomMember(classroomId)

  return (
    <Button
      variant="ghost"
      size="icon-sm"
      aria-label={`Remove ${item.user.name}`}
      disabled={removeMutation.isPending}
      onClick={() =>
        showConfirmation({
          icon: IconTrash,
          title: 'Remove student?',
          description: `"${item.user.name}" will be removed from this classroom.`,
          actionLabel: 'Remove',
          actionVariant: 'destructive',
          onAction: async ({ loading, close }) => {
            loading(true)

            try {
              await removeMutation.mutateAsync(item.id)
            } catch (error) {
              toast.error(getErrorMessage(error, 'Failed to delete classroom.'))
            } finally {
              loading(false)
              close()
            }
          },
        })
      }
    >
      <IconTrash className="text-destructive" />
    </Button>
  )
}

export function useClassroomMemberColumns(
  classroomId: number,
): ColumnDef<DataTableFeatures, IClassroomMember, unknown>[] {
  return useMemo<ColumnDef<DataTableFeatures, IClassroomMember, unknown>[]>(
    () => [
      {
        id: 'name',
        accessorKey: 'name',
        header: dataTableHeader('Name'),
        cell: ({ row }) => (
          <div className="flex min-w-0 flex-col">
            <span className="font-medium whitespace-nowrap">
              {row.original.user.name}
            </span>
            <span className="text-xs whitespace-nowrap text-muted-foreground">
              {row.original.user.identity_number}
            </span>
          </div>
        ),
      },
      {
        id: 'email',
        header: dataTableHeader('Email'),
        enableSorting: false,
        cell: ({ row }) => (
          <span className="whitespace-nowrap text-muted-foreground">
            {row.original.user.email}
          </span>
        ),
      },
      {
        id: 'gender',
        header: dataTableHeader('Gender'),
        enableSorting: false,
        cell: ({ row }) => (
          <Badge variant="secondary">
            {row.original.gender.label || row.original.gender.key}
          </Badge>
        ),
      },
      {
        id: 'status',
        header: dataTableHeader('Status'),
        enableSorting: false,
        cell: ({ row }) => (
          <Badge variant="secondary">{row.original.status.label}</Badge>
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
            <ClassroomMemberRemove
              classroomId={classroomId}
              item={row.original}
            />
          </div>
        ),
      },
    ],
    [classroomId],
  )
}
