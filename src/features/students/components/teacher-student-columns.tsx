import type { ColumnDef } from '@tanstack/react-table'
import type { DataTableFeatures } from '@/components/data-table/data-table'
import type {
  IStudent,
  IStudentLabel,
} from '@/features/students/types/student.types'

import { IconEye } from '@tabler/icons-react'
import { useMemo } from 'react'

import { dataTableHeader } from '@/components/data-table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { DATE_FORMAT } from '@/constants/app'
import { useStudentStore } from '@/features/students/components/student-store'
import { formatDate } from '@/utils/datetime'

interface TeacherStudentActionsProps {
  item: IStudent
}

function TeacherStudentActions({ item }: TeacherStudentActionsProps) {
  const openView = useStudentStore((state) => state.openView)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="ghost" size="icon-sm" aria-label="Open row actions">
            <IconEye className="size-4" />
          </Button>
        }
      />
      <DropdownMenuContent align="end" side="bottom" className="w-44">
        <DropdownMenuItem onClick={() => openView(item)}>
          <IconEye />
          <span>View Details</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

interface LabelBadgeProps {
  label: IStudentLabel
}

function GenderBadge({ label }: LabelBadgeProps) {
  return <Badge variant="secondary">{label.label || label.key}</Badge>
}

function StatusBadge({ label }: LabelBadgeProps) {
  const key = label.key.toLowerCase()
  if (key === 'active') return <Badge variant="default">{label.label}</Badge>
  if (key === 'graduated') return <Badge variant="default">{label.label}</Badge>
  return <Badge variant="outline">{label.label}</Badge>
}

export function useTeacherStudentColumns(): ColumnDef<
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
        cell: ({ row }) => <GenderBadge label={row.original.gender} />,
      },
      {
        id: 'status',
        header: dataTableHeader('Status'),
        enableSorting: false,
        cell: ({ row }) => <StatusBadge label={row.original.status} />,
      },
      {
        accessorKey: 'created_at',
        header: dataTableHeader('Created'),
        cell: ({ row }) => (
          <span className="whitespace-nowrap text-muted-foreground">
            {formatDate(row.original.created_at, DATE_FORMAT.DATE)}
          </span>
        ),
      },
      {
        id: 'actions',
        header: dataTableHeader('Actions'),
        enableSorting: false,
        cell: ({ row }) => (
          <div className="flex justify-end">
            <TeacherStudentActions item={row.original} />
          </div>
        ),
      },
    ],
    [],
  )
}
