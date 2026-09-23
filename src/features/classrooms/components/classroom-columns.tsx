import type { ColumnDef } from '@tanstack/react-table'
import type { DataTableFeatures } from '@/components/data-table/data-table'
import type { IClassroom } from '@/features/classrooms/types/classroom.types'

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
import { formatAcademicLabel } from '@/features/academic-years/components/academic-year-columns'
import { useClassroomStore } from '@/features/classrooms/components/classroom-store'
import { useDeleteClassroom } from '@/features/classrooms/hooks/use-delete-classroom'
import { useConfirmationStore } from '@/stores/confirmation-store'
import { formatDate } from '@/utils/datetime'
import { getErrorMessage } from '@/utils/error'

function ClassroomActions({ item }: { item: IClassroom }) {
  const openView = useClassroomStore((state) => state.openView)
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
          close()
        } catch (error) {
          toast.error(getErrorMessage(error, 'Failed to delete classroom.'))
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
          <span className="font-medium whitespace-nowrap">
            {row.original.name}
          </span>
        ),
      },
      {
        id: 'academic_year',
        header: dataTableHeader('Academic Year'),
        enableSorting: false,
        cell: ({ row }) => {
          const academicYear = row.original.academic_year
          if (!academicYear)
            return <span className="text-muted-foreground">-</span>
          return (
            <span className="whitespace-nowrap">
              {formatAcademicLabel({
                id: academicYear.id,
                start_date: academicYear.start_date,
                end_date: academicYear.end_date,
                semester: academicYear.semester,
                is_active: false,
                created_at: '',
                updated_at: '',
              })}
              <span className="text-muted-foreground">
                {' '}
                ({academicYear.semester})
              </span>
            </span>
          )
        },
      },
      {
        id: 'homeroom_teacher',
        header: dataTableHeader('Homeroom Teacher'),
        enableSorting: false,
        cell: ({ row }) => {
          const teacher = row.original.user
          if (!teacher) return <span className="text-muted-foreground">-</span>
          return <span className="whitespace-nowrap">{teacher.name}</span>
        },
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
