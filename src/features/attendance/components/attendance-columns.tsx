import type { ColumnDef } from '@tanstack/react-table'
import type { DataTableFeatures } from '@/components/data-table/data-table'
import type {
  IAttendanceLog,
  IAttendanceRequest,
} from '@/features/attendance/types/attendance.types'

import { IconCheck, IconX } from '@tabler/icons-react'
import { useMemo } from 'react'

import {
  dataTableHeader,
  dataTableHeaderActions,
} from '@/components/data-table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  postApproveAttendanceRequest,
  postRejectAttendanceRequest,
} from '@/features/attendance/services/attendance-api'
import { useConfirmationStore } from '@/stores/confirmation-store'
import { formatDate } from '@/utils/datetime'

function StatusBadge({ status }: { status: string }) {
  const key = status.toLowerCase()
  if (key === 'present') return <Badge variant="default">Present</Badge>
  if (key === 'absent') return <Badge variant="destructive">Absent</Badge>
  if (key === 'late') return <Badge variant="secondary">Late</Badge>
  if (key === 'permission') return <Badge variant="outline">Permission</Badge>
  return <Badge variant="secondary">{status}</Badge>
}

function RequestStatusBadge({ status }: { status: string }) {
  const key = status.toLowerCase()
  if (key === 'approved') return <Badge variant="default">Approved</Badge>
  if (key === 'rejected') return <Badge variant="destructive">Rejected</Badge>
  return <Badge variant="secondary">Waiting</Badge>
}

function AttendanceRequestActions({ item }: { item: IAttendanceRequest }) {
  const showConfirmation = useConfirmationStore((state) => state.show)

  const handleApprove = () => {
    showConfirmation({
      icon: IconCheck,
      title: 'Approve request?',
      description: `Approve the request from "${item.student.name}" for session "${item.session_subject}".`,
      actionLabel: 'Approve',
      actionVariant: 'default',
      onAction: async ({ close, loading }) => {
        loading(true)
        try {
          await postApproveAttendanceRequest(item.id)
          close()
        } catch {
          close()
        } finally {
          loading(false)
        }
      },
    })
  }

  const handleReject = () => {
    showConfirmation({
      icon: IconX,
      title: 'Reject request?',
      description: `Reject the request from "${item.student.name}" for session "${item.session_subject}".`,
      actionLabel: 'Reject',
      actionVariant: 'destructive',
      onAction: async ({ close, loading }) => {
        loading(true)
        try {
          await postRejectAttendanceRequest(item.id)
          close()
        } catch {
          close()
        } finally {
          loading(false)
        }
      },
    })
  }

  return (
    <div className="flex gap-1">
      <Button
        variant="default"
        size="icon-xs"
        onClick={handleApprove}
        aria-label="Approve request"
      >
        <IconCheck />
      </Button>
      <Button
        variant="destructive"
        size="icon-xs"
        onClick={handleReject}
        aria-label="Reject request"
      >
        <IconX />
      </Button>
    </div>
  )
}

export function useAttendanceLogColumns(): ColumnDef<
  DataTableFeatures,
  IAttendanceLog,
  unknown
>[] {
  return useMemo<ColumnDef<DataTableFeatures, IAttendanceLog, unknown>[]>(
    () => [
      {
        id: 'student',
        accessorKey: 'student.name',
        header: dataTableHeader('Student'),
        cell: ({ row }) => (
          <span className="font-medium">{row.original.student.name}</span>
        ),
      },
      {
        id: 'identity_number',
        accessorKey: 'student.identity_number',
        header: dataTableHeader('Identity Number'),
        enableSorting: false,
        cell: ({ row }) => (
          <span className="whitespace-nowrap text-muted-foreground">
            {row.original.student.identity_number}
          </span>
        ),
      },
      {
        id: 'class_name',
        accessorKey: 'class_name',
        header: dataTableHeader('Class'),
        enableSorting: false,
        cell: ({ row }) => (
          <span className="whitespace-nowrap">{row.original.class_name}</span>
        ),
      },
      {
        id: 'status',
        accessorKey: 'status',
        header: dataTableHeader('Status'),
        cell: ({ row }) => <StatusBadge status={row.original.status} />,
      },
      {
        id: 'scanned_at',
        accessorKey: 'scanned_at',
        header: dataTableHeader('Scanned At'),
        cell: ({ row }) => (
          <span className="whitespace-nowrap text-muted-foreground">
            {row.original.scanned_at
              ? formatDate(row.original.scanned_at, 'DD MMMM YYYY HH:mm:ss')
              : '-'}
          </span>
        ),
      },
    ],
    [],
  )
}

export function useAttendanceRequestColumns(): ColumnDef<
  DataTableFeatures,
  IAttendanceRequest,
  unknown
>[] {
  return useMemo<ColumnDef<DataTableFeatures, IAttendanceRequest, unknown>[]>(
    () => [
      {
        id: 'student',
        accessorKey: 'student.name',
        header: dataTableHeader('Student'),
        cell: ({ row }) => (
          <span className="font-medium">{row.original.student.name}</span>
        ),
      },
      {
        id: 'class_name',
        accessorKey: 'class_name',
        header: dataTableHeader('Class'),
        enableSorting: false,
        cell: ({ row }) => (
          <span className="whitespace-nowrap text-muted-foreground">
            {row.original.class_name}
          </span>
        ),
      },
      {
        id: 'reason',
        accessorKey: 'reason',
        header: dataTableHeader('Reason'),
        enableSorting: false,
        cell: ({ row }) => (
          <span className="max-w-[200px] truncate">{row.original.reason}</span>
        ),
      },
      {
        id: 'purpose',
        accessorKey: 'purpose',
        header: dataTableHeader('Purpose'),
        enableSorting: false,
        cell: ({ row }) => (
          <span className="max-w-[200px] truncate">{row.original.purpose}</span>
        ),
      },
      {
        id: 'status',
        accessorKey: 'status',
        header: dataTableHeader('Status'),
        cell: ({ row }) => <RequestStatusBadge status={row.original.status} />,
      },
      {
        id: 'actions',
        header: dataTableHeaderActions,
        enableSorting: false,
        cell: ({ row }) => (
          <div className="flex justify-end">
            <AttendanceRequestActions item={row.original} />
          </div>
        ),
      },
    ],
    [],
  )
}
