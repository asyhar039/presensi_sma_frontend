import type { ColumnDef } from '@tanstack/react-table'
import type { DataTableFeatures } from '@/components/data-table/data-table'
import type { IAcademicYear } from '@/features/academic-years/types/academic-year.types'

import {
  IconArrowDown,
  IconArrowUp,
  IconArrowsSort,
  IconDotsVertical,
  IconEye,
  IconPencil,
  IconTrash,
} from '@tabler/icons-react'
import { useMemo } from 'react'
import { toast } from 'sonner'

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
import { useAcademicYearStore } from '@/features/academic-years/components/academic-year-store'
import { useDeleteAcademicYear } from '@/features/academic-years/hooks/use-delete-academic-year'
import { useConfirmationStore } from '@/stores/confirmation-store'
import { formatDate } from '@/utils/datetime'
import { getErrorMessage } from '@/utils/error'

function SortableHeader({
  title,
  sorted,
}: {
  title: string
  sorted: false | 'asc' | 'desc'
}) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span>{title}</span>
      {sorted === 'asc' ? (
        <IconArrowUp className="size-3.5 text-foreground" />
      ) : sorted === 'desc' ? (
        <IconArrowDown className="size-3.5 text-foreground" />
      ) : (
        <IconArrowsSort className="size-3.5 text-muted-foreground" />
      )}
    </span>
  )
}

function AcademicYearActions({ item }: { item: IAcademicYear }) {
  const openView = useAcademicYearStore((state) => state.openView)
  const openEdit = useAcademicYearStore((state) => state.openEdit)
  const showConfirmation = useConfirmationStore((state) => state.show)
  const deleteMutation = useDeleteAcademicYear()

  const handleDelete = () => {
    showConfirmation({
      icon: IconTrash,
      title: 'Delete academic year?',
      description: `This will permanently delete the ${formatSemester(item.semester)} academic year. This action cannot be undone.`,
      actionLabel: 'Delete',
      actionVariant: 'destructive',
      onAction: async ({ close, loading }) => {
        loading(true)
        try {
          await deleteMutation.mutateAsync(item.id)
          close()
        } catch (error) {
          toast.error(getErrorMessage(error, 'Failed to delete academic year.'))
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

export function formatSemester(value: string): string {
  return value.toLowerCase() === 'odd'
    ? 'Odd'
    : value.toLowerCase() === 'even'
      ? 'Even'
      : value
}

export function formatAcademicLabel(item: IAcademicYear): string {
  const startYear = formatDate(item.start_date, 'YYYY', '')
  const endYear = formatDate(item.end_date, 'YYYY', '')
  if (!startYear || !endYear) return `#${item.id}`
  return startYear === endYear ? startYear : `${startYear}/${endYear}`
}

export function useAcademicYearColumns(): ColumnDef<
  DataTableFeatures,
  IAcademicYear,
  unknown
>[] {
  return useMemo<ColumnDef<DataTableFeatures, IAcademicYear, unknown>[]>(
    () => [
      {
        id: 'label',
        header: 'Academic Year',
        enableSorting: false,
        cell: ({ row }) => (
          <span className="font-medium whitespace-nowrap">
            {formatAcademicLabel(row.original)}
          </span>
        ),
      },
      {
        accessorKey: 'semester',
        header: ({ column }) => (
          <Button
            variant="ghost"
            size="xs"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            aria-label="Sort by semester"
          >
            <SortableHeader title="Semester" sorted={column.getIsSorted()} />
          </Button>
        ),
        cell: ({ row }) => (
          <Badge
            variant={row.original.semester === 'odd' ? 'default' : 'secondary'}
          >
            {formatSemester(row.original.semester)}
          </Badge>
        ),
      },
      {
        accessorKey: 'start_date',
        header: ({ column }) => (
          <Button
            variant="ghost"
            size="xs"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            aria-label="Sort by start date"
          >
            <SortableHeader title="Start Date" sorted={column.getIsSorted()} />
          </Button>
        ),
        cell: ({ row }) => (
          <span className="whitespace-nowrap">
            {formatDate(row.original.start_date, DATE_FORMAT.DATE)}
          </span>
        ),
      },
      {
        accessorKey: 'end_date',
        header: ({ column }) => (
          <Button
            variant="ghost"
            size="xs"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            aria-label="Sort by end date"
          >
            <SortableHeader title="End Date" sorted={column.getIsSorted()} />
          </Button>
        ),
        cell: ({ row }) => (
          <span className="whitespace-nowrap">
            {formatDate(row.original.end_date, DATE_FORMAT.DATE)}
          </span>
        ),
      },
      {
        accessorKey: 'is_active',
        header: ({ column }) => (
          <Button
            variant="ghost"
            size="xs"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            aria-label="Sort by status"
          >
            <SortableHeader title="Status" sorted={column.getIsSorted()} />
          </Button>
        ),
        cell: ({ row }) =>
          row.original.is_active ? (
            <Badge variant="default">Active</Badge>
          ) : (
            <Badge variant="outline">Inactive</Badge>
          ),
      },
      {
        accessorKey: 'created_at',
        header: ({ column }) => (
          <Button
            variant="ghost"
            size="xs"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            aria-label="Sort by created date"
          >
            <SortableHeader title="Created At" sorted={column.getIsSorted()} />
          </Button>
        ),
        cell: ({ row }) => (
          <span className="whitespace-nowrap text-muted-foreground">
            {formatDate(row.original.created_at, DATE_FORMAT.DATE)}
          </span>
        ),
      },
      {
        id: 'actions',
        header: () => <span className="sr-only">Actions</span>,
        enableSorting: false,
        cell: ({ row }) => (
          <div className="flex justify-end">
            <AcademicYearActions item={row.original} />
          </div>
        ),
      },
    ],
    [],
  )
}
