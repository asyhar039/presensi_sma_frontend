import type { ColumnDef } from '@tanstack/react-table'
import type { DataTableFeatures } from '@/components/data-table/data-table'
import type { IAttendanceRecord } from '@/features/attendance/types/attendance.types'

import { IconEye } from '@tabler/icons-react'
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
import { DATE_FORMAT } from '@/constants/app'
import {
  ATTENDANCE_STATUS_BADGE_VARIANTS,
  ATTENDANCE_STATUS_LABELS,
} from '@/features/attendance/types/attendance.types'
import { formatDate } from '@/utils/datetime'

function AttendanceStatusBadge({
  status,
}: {
  status: IAttendanceRecord['status']
}) {
  const variant = ATTENDANCE_STATUS_BADGE_VARIANTS[status]
  const label = ATTENDANCE_STATUS_LABELS[status]
  return <Badge variant={variant}>{label}</Badge>
}

function AttendanceActions({ item }: { item: IAttendanceRecord }) {
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
          onClick={() =>
            window.open(
              `/dashboard/attendance-recap/${item.student_id}`,
              '_blank',
            )
          }
        >
          <IconEye />
          <span>Lihat Detail Siswa</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export function useAttendanceColumns(): ColumnDef<
  DataTableFeatures,
  IAttendanceRecord,
  unknown
>[] {
  return useMemo<ColumnDef<DataTableFeatures, IAttendanceRecord, unknown>[]>(
    () => [
      {
        id: 'nis',
        accessorKey: 'student_id',
        header: dataTableHeader('NIS'),
        cell: ({ row }) => (
          <span className="font-medium whitespace-nowrap text-muted-foreground">
            {row.original.student.user.identity_number}
          </span>
        ),
      },
      {
        id: 'name',
        header: dataTableHeader('Nama Lengkap'),
        cell: ({ row }) => (
          <span className="font-medium whitespace-nowrap">
            {row.original.student.user.name}
          </span>
        ),
      },
      {
        id: 'subject',
        header: dataTableHeader('Mata Pelajaran'),
        enableSorting: false,
        cell: ({ row }) => (
          <span className="whitespace-nowrap text-muted-foreground">
            {row.original.subject_name}
          </span>
        ),
      },
      {
        id: 'date',
        accessorKey: 'date',
        header: dataTableHeader('Tanggal'),
        cell: ({ row }) => (
          <span className="whitespace-nowrap text-muted-foreground">
            {formatDate(row.original.date, DATE_FORMAT.DATE)}
          </span>
        ),
      },
      {
        id: 'time',
        header: dataTableHeader('Waktu'),
        enableSorting: false,
        cell: ({ row }) => (
          <span className="whitespace-nowrap text-muted-foreground">
            {row.original.time_start} - {row.original.time_end}
          </span>
        ),
      },
      {
        id: 'room',
        header: dataTableHeader('Ruang'),
        enableSorting: false,
        cell: ({ row }) => (
          <span className="whitespace-nowrap text-muted-foreground">
            {row.original.room_name || '-'}
          </span>
        ),
      },
      {
        id: 'status',
        header: dataTableHeader('Status'),
        enableSorting: false,
        cell: ({ row }) => (
          <AttendanceStatusBadge status={row.original.status} />
        ),
      },
      {
        id: 'description',
        header: dataTableHeader('Keterangan'),
        enableSorting: false,
        cell: ({ row }) => (
          <span className="whitespace-nowrap text-muted-foreground max-w-[200px] truncate block">
            {row.original.description || '-'}
          </span>
        ),
      },
      {
        id: 'actions',
        header: dataTableHeaderActions,
        enableSorting: false,
        cell: ({ row }) => (
          <div className="flex justify-end">
            <AttendanceActions item={row.original} />
          </div>
        ),
      },
    ],
    [],
  )
}
