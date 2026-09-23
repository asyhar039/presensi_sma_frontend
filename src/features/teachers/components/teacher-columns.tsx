import type { ColumnDef } from '@tanstack/react-table'
import type { DataTableFeatures } from '@/components/data-table/data-table'
import type { ITeacher } from '@/features/teachers/types/teacher.types'

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
import { useTeacherStore } from '@/features/teachers/components/teacher-store'
import { useDeleteTeacher } from '@/features/teachers/hooks/use-delete-teacher'
import { useConfirmationStore } from '@/stores/confirmation-store'
import { formatDate } from '@/utils/datetime'
import { getErrorMessage } from '@/utils/error'

function TeacherActions({ item }: { item: ITeacher }) {
  const openView = useTeacherStore((state) => state.openView)
  const openEdit = useTeacherStore((state) => state.openEdit)
  const openPassword = useTeacherStore((state) => state.openPassword)
  const showConfirmation = useConfirmationStore((state) => state.show)
  const deleteMutation = useDeleteTeacher()

  const handleDelete = () => {
    showConfirmation({
      icon: IconTrash,
      title: 'Delete teacher?',
      description: `This will permanently delete the teacher "${item.user.name}". This action cannot be undone.`,
      actionLabel: 'Delete',
      actionVariant: 'destructive',
      onAction: async ({ close, loading }) => {
        loading(true)
        try {
          await deleteMutation.mutateAsync(item.id)
          close()
        } catch (error) {
          toast.error(getErrorMessage(error, 'Failed to delete teacher.'))
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

function GenderBadge({ gender }: { gender: ITeacher['gender'] }) {
  return <Badge variant="secondary">{gender.label || gender.key}</Badge>
}

function EmploymentStatusBadge({
  employment_status,
}: {
  employment_status: ITeacher['employment_status']
}) {
  const key = employment_status.key.toLowerCase()
  if (key === 'pns')
    return <Badge variant="default">{employment_status.label}</Badge>
  if (key === 'pppk')
    return <Badge variant="secondary">{employment_status.label}</Badge>
  return <Badge variant="outline">{employment_status.label}</Badge>
}

export function useTeacherColumns(): ColumnDef<
  DataTableFeatures,
  ITeacher,
  unknown
>[] {
  return useMemo<ColumnDef<DataTableFeatures, ITeacher, unknown>[]>(
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
        id: 'employment_status',
        header: dataTableHeader('Employment Status'),
        enableSorting: false,
        cell: ({ row }) => (
          <EmploymentStatusBadge
            employment_status={row.original.employment_status}
          />
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
            <TeacherActions item={row.original} />
          </div>
        ),
      },
    ],
    [],
  )
}
