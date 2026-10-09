import type { ColumnDef } from '@tanstack/react-table'
import type { DataTableFeatures } from '@/components/data-table/data-table'
import type { IClassroom } from '@/features/classrooms/types/classroom.types'

import {
  IconDotsVertical,
  IconEye,
  IconPencil,
  IconTrash,
} from '@tabler/icons-react'
import { Link } from '@tanstack/react-router'
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
import { useClassroomStore } from '@/features/classrooms/components/classroom-store'
import { useDeleteClassroom } from '@/features/classrooms/hooks/use-delete-classroom'
import { useConfirmationStore } from '@/stores/confirmation-store'
import { formatDate } from '@/utils/datetime'
import { getErrorMessage } from '@/utils/error'

type ClassroomActionsProps = { item: IClassroom }

function ClassroomActions({ item }: ClassroomActionsProps) {
  const openEdit = useClassroomStore((state) => state.openEdit)
  const showConfirmation = useConfirmationStore((state) => state.show)
  const deleteMutation = useDeleteClassroom()

  const handleDelete = () => {
    showConfirmation({
      icon: IconTrash,
      title: 'Delete classroom?',
      description: `This will permanently delete the classroom "${item.name}". This action cannot be undone.`,
      actionLabel: 'Delete',
      actionVariant: 'destructive',
      onAction: async ({ close, loading }) => {
        loading(true)
        try {
          await deleteMutation.mutateAsync(item.id)
        } catch (error) {
          toast.error(getErrorMessage(error, 'Failed to delete classroom.'))
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
        <DropdownMenuItem
          render={
            <Link
              to="/dashboard/classrooms/$classroomId"
              params={{ classroomId: String(item.id) }}
              className="flex items-center gap-2"
            >
              <IconEye />
              <span>View detail</span>
            </Link>
          }
        />
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

export function useClassroomColumns(): ColumnDef<
  DataTableFeatures,
  IClassroom,
  unknown
>[] {
  return useMemo<ColumnDef<DataTableFeatures, IClassroom, unknown>[]>(
    () => [
      {
        accessorKey: 'name',
        header: dataTableHeader('Classroom'),
        cell: ({ row }) => (
          <Link
            to="/dashboard/classrooms/$classroomId"
            params={{ classroomId: String(row.original.id) }}
            className="font-medium whitespace-nowrap hover:underline"
          >
            {row.original.name}
          </Link>
        ),
      },
      {
        id: 'academic_year',
        header: dataTableHeader('Academic Year'),
        enableSorting: false,
        cell: ({ row }) =>
          row.original.academic_year ? (
            <span className="whitespace-nowrap">
              {row.original.academic_year.label}
            </span>
          ) : (
            <span className="text-muted-foreground">-</span>
          ),
      },
      {
        id: 'homeroom_teacher',
        header: dataTableHeader('Homeroom Teacher'),
        enableSorting: false,
        cell: ({ row }) =>
          row.original.homeroom_teacher ? (
            <span className="whitespace-nowrap">
              {row.original.homeroom_teacher.name}
            </span>
          ) : (
            <span className="text-muted-foreground">-</span>
          ),
      },
      {
        accessorKey: 'students_count',
        header: dataTableHeader('Students'),
        enableSorting: false,
        cell: ({ row }) => (
          <Badge variant="secondary">{row.original.students_count ?? 0}</Badge>
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
            <ClassroomActions item={row.original} />
          </div>
        ),
      },
    ],
    [],
  )
}
