import type { ColumnDef } from '@tanstack/react-table'
import type { DataTableFeatures } from '@/components/data-table/data-table'
import type { ISubject } from '@/features/subjects/types/subject.types'

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
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { DATE_FORMAT } from '@/constants/app'
import { useSubjectStore } from '@/features/subjects/components/subject-store'
import { useDeleteSubject } from '@/features/subjects/hooks/use-delete-subject'
import { useConfirmationStore } from '@/stores/confirmation-store'
import { formatDate } from '@/utils/datetime'
import { getErrorMessage } from '@/utils/error'

function SubjectActions({ item }: { item: ISubject }) {
  const openView = useSubjectStore((state) => state.openView)
  const openEdit = useSubjectStore((state) => state.openEdit)
  const showConfirmation = useConfirmationStore((state) => state.show)
  const deleteMutation = useDeleteSubject()

  const handleDelete = () => {
    showConfirmation({
      icon: IconTrash,
      title: 'Delete subject?',
      description: `This will permanently delete the subject "${item.name}". This action cannot be undone.`,
      actionLabel: 'Delete',
      actionVariant: 'destructive',
      onAction: async ({ close, loading }) => {
        loading(true)
        try {
          await deleteMutation.mutateAsync(item.id)
          close()
        } catch (error) {
          toast.error(getErrorMessage(error, 'Failed to delete subject.'))
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
      <DropdownMenuContent align="end" side="bottom">
        <DropdownMenuItem onClick={() => openView(item)}>
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

export function useSubjectColumns(): ColumnDef<
  DataTableFeatures,
  ISubject,
  unknown
>[] {
  return useMemo<ColumnDef<DataTableFeatures, ISubject, unknown>[]>(
    () => [
      {
        accessorKey: 'name',
        header: dataTableHeader('Subject Name'),
        cell: ({ row }) => (
          <span className="font-medium whitespace-nowrap">
            {row.original.name}
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
            <SubjectActions item={row.original} />
          </div>
        ),
      },
    ],
    [],
  )
}
