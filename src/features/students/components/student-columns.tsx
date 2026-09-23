import type { ColumnDef } from '@tanstack/react-table'
import type { DataTableFeatures } from '@/components/data-table/data-table'
import type { IStudent } from '@/features/students/types/student.types'

import {
  IconDotsVertical,
  IconEye,
  IconKey,
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
import { useStudentStore } from '@/features/students/components/student-store'
import { useDeleteStudent } from '@/features/students/hooks/use-delete-student'
import { useConfirmationStore } from '@/stores/confirmation-store'
import { formatDate } from '@/utils/datetime'
import { getErrorMessage } from '@/utils/error'

function StudentActions({ item }: { item: IStudent }) {
  const openView = useStudentStore((state) => state.openView)
  const openEdit = useStudentStore((state) => state.openEdit)
  const openPassword = useStudentStore((state) => state.openPassword)
  const showConfirmation = useConfirmationStore((state) => state.show)
  const deleteMutation = useDeleteStudent()

  const handleDelete = () => {
    showConfirmation({
      icon: IconTrash,
      title: 'Delete student?',
      description: `This will permanently delete the student "${item.user.name}". This action cannot be undone.`,
      actionLabel: 'Delete',
      actionVariant: 'destructive',
      onAction: async ({ close, loading }) => {
        loading(true)
        try {
          await deleteMutation.mutateAsync(item.id)
          close()
        } catch (error) {
          toast.error(getErrorMessage(error, 'Failed to delete student.'))
        } finally {
          loading(false)
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
      <DropdownMenuContent align="end" side="bottom" className="w-44">
        <DropdownMenuItem onClick={() => openView(item)}>
          <IconEye />
          <span>View detail</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => openEdit(item)}>
          <IconPencil />
          <span>Edit</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => openPassword(item)}>
          <IconKey />
          <span>Reset password</span>
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

function GenderBadge({ gender }: { gender: IStudent['gender'] }) {
  return <Badge variant="secondary">{gender.label || gender.key}</Badge>
}

function StatusBadge({ status }: { status: IStudent['status'] }) {
  const key = status.key.toLowerCase()
  if (key === 'active') return <Badge variant="default">{status.label}</Badge>
  if (key === 'graduated')
    return <Badge variant="default">{status.label}</Badge>
  return <Badge variant="outline">{status.label}</Badge>
}

export function useStudentColumns(): ColumnDef<
  DataTableFeatures,
  IStudent,
  unknown
>[] {
  return useMemo<ColumnDef<DataTableFeatures, IStudent, unknown>[]>(
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
        cell: ({ row }) => <GenderBadge gender={row.original.gender} />,
      },
      {
        id: 'status',
        header: dataTableHeader('Status'),
        enableSorting: false,
        cell: ({ row }) => <StatusBadge status={row.original.status} />,
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
            <StudentActions item={row.original} />
          </div>
        ),
      },
    ],
    [],
  )
}
