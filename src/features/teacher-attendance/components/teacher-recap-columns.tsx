import type { ColumnDef } from '@tanstack/react-table'
import type { DataTableFeatures } from '@/components/data-table/data-table'
import type { ITeacherAttendanceItem } from '@/features/teacher-attendance/types/teacher-attendance.types'

import { IconEye } from '@tabler/icons-react'
import { Link } from '@tanstack/react-router'
import { useMemo } from 'react'

import { dataTableHeader } from '@/components/data-table'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

type TeacherRecapActionsProps = {
  item: ITeacherAttendanceItem
}

function initials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('')
}

function CountCell({ value, label }: { value: number; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 whitespace-nowrap text-sm">
      <span className="font-semibold tabular-nums">{value}</span>
      <span className="text-muted-foreground">{label}</span>
    </span>
  )
}

function RateCell({ value }: { value: number }) {
  return (
    <div className="flex min-w-28 items-center gap-2">
      <span className="h-1.5 w-16 overflow-hidden rounded-full bg-muted">
        <span
          className="block h-full rounded-full bg-primary"
          style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
        />
      </span>
      <span className="text-sm font-medium tabular-nums">
        {value.toFixed(0)}%
      </span>
    </div>
  )
}

function TeacherRecapActions({ item }: TeacherRecapActionsProps) {
  return (
    <div className="flex justify-end">
      <Button
        variant="ghost"
        size="icon-sm"
        aria-label="View attendance detail"
      >
        <Link
          to="/dashboard/attendance-recap/$studentId"
          params={{ studentId: String(item.student.id) }}
          search={(prev) => prev}
          className="flex items-center"
        >
          <IconEye className="size-4" />
        </Link>
      </Button>
    </div>
  )
}

export function useTeacherRecapColumns(): ColumnDef<
  DataTableFeatures,
  ITeacherAttendanceItem,
  unknown
>[] {
  return useMemo<
    ColumnDef<DataTableFeatures, ITeacherAttendanceItem, unknown>[]
  >(
    () => [
      {
        id: 'name',
        header: dataTableHeader('Student'),
        cell: ({ row }) => (
          <div className="flex min-w-0 items-center gap-3">
            <Avatar className="size-8 shrink-0">
              <AvatarFallback className="text-xs">
                {initials(row.original.student.name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex min-w-0 flex-col">
              <span className="truncate font-medium">
                {row.original.student.name}
              </span>
              <span className="text-xs text-muted-foreground">
                NIS {row.original.student.identity_number}
              </span>
            </div>
          </div>
        ),
      },
      {
        id: 'class',
        header: dataTableHeader('Class'),
        enableSorting: false,
        cell: ({ row }) => (
          <Badge variant="secondary" className="whitespace-nowrap">
            {row.original.class.name}
          </Badge>
        ),
      },
      {
        id: 'present',
        header: dataTableHeader('Present'),
        enableSorting: false,
        cell: ({ row }) => (
          <CountCell value={row.original.attendance.present} label="days" />
        ),
      },
      {
        id: 'sick_leave',
        header: dataTableHeader('Sick'),
        enableSorting: false,
        cell: ({ row }) => (
          <CountCell value={row.original.attendance.sick_leave} label="days" />
        ),
      },
      {
        id: 'permit',
        header: dataTableHeader('Permit'),
        enableSorting: false,
        cell: ({ row }) => (
          <CountCell value={row.original.attendance.permit} label="days" />
        ),
      },
      {
        id: 'alpha',
        header: dataTableHeader('Absent'),
        enableSorting: false,
        cell: ({ row }) => (
          <CountCell value={row.original.attendance.alpha} label="days" />
        ),
      },
      {
        id: 'attendance_percentage',
        header: dataTableHeader('Rate'),
        enableSorting: false,
        cell: ({ row }) => (
          <RateCell
            value={row.original.attendance.attendance_percentage ?? 0}
          />
        ),
      },
      {
        id: 'actions',
        header: () => <span className="sr-only">Actions</span>,
        enableSorting: false,
        cell: ({ row }) => <TeacherRecapActions item={row.original} />,
      },
    ],
    [],
  )
}
