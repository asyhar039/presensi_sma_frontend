import type { ColumnDef } from '@tanstack/react-table'
import type { DataTableFeatures } from '@/components/data-table/data-table'

import { IconEye } from '@tabler/icons-react'
import { useMemo } from 'react'

import {
  dataTableHeader,
  dataTableHeaderActions,
} from '@/components/data-table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

type SessionRow = {
  id: number
  date: string
  time: string
  subject: string
  present: number
  absent: number
  late: number
  permission: number
  status: string
  session_id: number
}

export type { SessionRow }

function SessionStatusBadge({ status }: { status: string }) {
  const key = status.toLowerCase()
  if (key === 'closed') return <Badge variant="default">Selesai</Badge>
  if (key === 'active') return <Badge variant="secondary">Aktif</Badge>
  if (key === 'scheduled') return <Badge variant="outline">Jadwal</Badge>
  return <Badge variant="secondary">{status}</Badge>
}

export function useAttendanceHistoryColumns({
  onSessionClick,
}: {
  onSessionClick: (sessionId: number) => void
}): ColumnDef<DataTableFeatures, SessionRow, unknown>[] {
  return useMemo<ColumnDef<DataTableFeatures, SessionRow, unknown>[]>(
    () => [
      {
        id: 'date',
        accessorKey: 'date',
        header: dataTableHeader('TANGGAL'),
        cell: ({ row }) => (
          <span className="whitespace-nowrap">{row.original.date}</span>
        ),
      },
      {
        id: 'time',
        accessorKey: 'time',
        header: dataTableHeader('WAKTU'),
        cell: ({ row }) => (
          <span className="whitespace-nowrap text-muted-foreground">
            {row.original.time}
          </span>
        ),
      },
      {
        id: 'subject',
        accessorKey: 'subject',
        header: dataTableHeader('TOPIK / MATERI'),
        cell: ({ row }) => (
          <span className="font-medium">{row.original.subject}</span>
        ),
      },
      {
        id: 'summary',
        header: dataTableHeader('RINGKASAN PRESENSI'),
        cell: ({ row }) => {
          const { present, absent, late, permission } = row.original
          return (
            <div className="flex items-center gap-1.5">
              {present > 0 && (
                <Badge variant="default" className="text-[10px]">
                  {present} H
                </Badge>
              )}
              {permission > 0 && (
                <Badge variant="outline" className="text-[10px]">
                  {permission} I
                </Badge>
              )}
              {late > 0 && (
                <Badge variant="secondary" className="text-[10px]">
                  {late} S
                </Badge>
              )}
              {absent > 0 && (
                <Badge variant="destructive" className="text-[10px]">
                  {absent} A
                </Badge>
              )}
              {present === 0 &&
                absent === 0 &&
                late === 0 &&
                permission === 0 && (
                  <span className="text-muted-foreground text-xs">-</span>
                )}
            </div>
          )
        },
      },
      {
        id: 'status',
        accessorKey: 'status',
        header: dataTableHeader('STATUS'),
        cell: ({ row }) => <SessionStatusBadge status={row.original.status} />,
      },
      {
        id: 'actions',
        header: dataTableHeaderActions,
        enableSorting: false,
        cell: ({ row }) => (
          <div className="flex justify-end">
            <Button
              variant="outline"
              size="icon-xs"
              onClick={() => onSessionClick(row.original.session_id)}
              aria-label="View session details"
            >
              <IconEye className="size-4" />
            </Button>
          </div>
        ),
      },
    ],
    [onSessionClick],
  )
}
