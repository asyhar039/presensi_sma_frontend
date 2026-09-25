import type { ColumnDef } from '@tanstack/react-table'
import type { DataTableFeatures } from '@/components/data-table/data-table'
import type { IStudentAttendanceSummary } from '@/features/attendance/types/attendance.types'

import { IconEye } from '@tabler/icons-react'
import { Link } from '@tanstack/react-router'
import { useMemo } from 'react'

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
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  ATTENDANCE_STATUS_BADGE_VARIANTS,
  ATTENDANCE_STATUS_LABELS,
} from '@/features/attendance/types/attendance.types'

function CountBadge({
  count,
  status,
}: {
  count: number
  status: 'present' | 'permission' | 'sick' | 'absent'
}) {
  const variant = ATTENDANCE_STATUS_BADGE_VARIANTS[status]
  const label = ATTENDANCE_STATUS_LABELS[status]
  return (
    <Badge variant={variant} className="gap-1">
      {count}
      <span className="text-xs">{label}</span>
    </Badge>
  )
}

function SummaryActions({ item }: { item: IStudentAttendanceSummary }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="ghost" size="icon-sm" aria-label="Open row actions">
            <IconEye className="size-4" />
          </Button>
        }
      />
      <DropdownMenuContent align="end" side="bottom" className="w-48">
        <DropdownMenuItem
          render={
            <Link
              to="/dashboard/attendance-recap/$studentId"
              params={{ studentId: item.student_id.toString() }}
              className="flex items-center gap-2"
            >
              <IconEye />
              <span>Lihat Detail Siswa</span>
            </Link>
          }
        >
          <IconEye />
          <span>Lihat Detail Siswa</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export function useAttendanceSummaryColumns(): ColumnDef<
  DataTableFeatures,
  IStudentAttendanceSummary,
  unknown
>[] {
  return useMemo<
    ColumnDef<DataTableFeatures, IStudentAttendanceSummary, unknown>[]
  >(
    () => [
      {
        id: 'nis',
        accessorKey: 'student_id',
        header: dataTableHeader('NIS'),
        cell: ({ row }) => (
          <span className="font-medium whitespace-nowrap text-muted-foreground">
            {row.original.student_nis}
          </span>
        ),
      },
      {
        id: 'name',
        header: dataTableHeader('Nama Lengkap'),
        cell: ({ row }) => (
          <span className="font-medium whitespace-nowrap">
            {row.original.student_name}
          </span>
        ),
      },
      {
        id: 'present',
        header: dataTableHeader('Hadir'),
        enableSorting: false,
        cell: ({ row }) => (
          <CountBadge count={row.original.present} status="present" />
        ),
      },
      {
        id: 'permission',
        header: dataTableHeader('Izin'),
        enableSorting: false,
        cell: ({ row }) => (
          <CountBadge count={row.original.permission} status="permission" />
        ),
      },
      {
        id: 'sick',
        header: dataTableHeader('Sakit'),
        enableSorting: false,
        cell: ({ row }) => (
          <CountBadge count={row.original.sick} status="sick" />
        ),
      },
      {
        id: 'absent',
        header: dataTableHeader('Alpa'),
        enableSorting: false,
        cell: ({ row }) => (
          <CountBadge count={row.original.absent} status="absent" />
        ),
      },
      {
        id: 'attendance_rate',
        header: dataTableHeader('Kehadiran (%)'),
        cell: ({ row }) => (
          <span className="font-medium whitespace-nowrap">
            {row.original.attendance_rate.toFixed(1)}%
          </span>
        ),
      },
      {
        id: 'actions',
        header: dataTableHeaderActions,
        enableSorting: false,
        cell: ({ row }) => (
          <div className="flex justify-end">
            <SummaryActions item={row.original} />
          </div>
        ),
      },
    ],
    [],
  )
}
