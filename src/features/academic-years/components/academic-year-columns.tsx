import type { ColumnDef } from '@tanstack/react-table'
import type { DataTableFeatures } from '@/components/data-table/data-table'
import type { IAcademicYear } from '@/features/academic-years/types/academic-year.types'

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
import { useAcademicYearStore } from '@/features/academic-years/components/academic-year-store'
import { useDeleteAcademicYear } from '@/features/academic-years/hooks/use-delete-academic-year'
import { useConfirmationStore } from '@/stores/confirmation-store'
import { formatDate } from '@/utils/datetime'
import { getErrorMessage } from '@/utils/error'

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

function StatusBadge({ isActive }: { isActive: boolean }) {
  if (isActive) return <Badge variant="default">Active</Badge>
  return <Badge variant="outline">Inactive</Badge>
}

function SemesterBadge({ value }: { value: string }) {
  if (value === 'odd') return <Badge variant="default">Odd</Badge>
  return <Badge variant="secondary">{formatSemester(value)}</Badge>
}

export function formatSemester(value: string): string {
  const normalized = value.toLowerCase()
  if (normalized === 'odd') return 'Odd'
  if (normalized === 'even') return 'Even'
  return value
}

export function formatAcademicLabel(item: IAcademicYear): string {
  const startYear = formatDate(item.start_date, 'YYYY', '')
  const endYear = formatDate(item.end_date, 'YYYY', '')
  if (!startYear || !endYear) return `#${item.id}`
  if (startYear === endYear) return startYear
  return `${startYear}/${endYear}`
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
        header: dataTableHeader('Academic Year'),
        enableSorting: false,
        cell: ({ row }) => (
          <span className="font-medium whitespace-nowrap">
            {formatAcademicLabel(row.original)}
          </span>
        ),
      },
      {
        accessorKey: 'semester',
        header: dataTableHeader('Semester'),
        cell: ({ row }) => <SemesterBadge value={row.original.semester} />,
      },
      {
        accessorKey: 'start_date',
        header: dataTableHeader('Start Date'),
        cell: ({ row }) => (
          <span className="whitespace-nowrap">
            {formatDate(row.original.start_date, DATE_FORMAT.DATE)}
          </span>
        ),
      },
      {
        accessorKey: 'end_date',
        header: dataTableHeader('End Date'),
        cell: ({ row }) => (
          <span className="whitespace-nowrap">
            {formatDate(row.original.end_date, DATE_FORMAT.DATE)}
          </span>
        ),
      },
      {
        accessorKey: 'is_active',
        header: dataTableHeader('Status'),
        cell: ({ row }) => <StatusBadge isActive={row.original.is_active} />,
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
            <AcademicYearActions item={row.original} />
          </div>
        ),
      },
    ],
    [],
  )
}
