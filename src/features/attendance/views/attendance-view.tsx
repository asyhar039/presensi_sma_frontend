import type { ColumnDef } from '@tanstack/react-table'
import type { DataTableFeatures } from '@/components/data-table/data-table'
import type { IAttendanceRequest } from '@/features/attendance/types/attendance.types'

import { IconQrcode, IconRefresh, IconTrendingUp } from '@tabler/icons-react'
import { useMemo } from 'react'
import { toast } from 'sonner'

import { DataTable } from '@/components/data-table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  postApproveAttendanceRequest,
  postRejectAttendanceRequest,
} from '@/features/attendance/services/attendance-api'
import { useConfirmationStore } from '@/stores/confirmation-store'
import {
  useAttendanceLogColumns,
  useAttendanceRequestColumns,
} from '../components/attendance-columns'
import {
  AttendanceProvider,
  useAttendanceStore,
} from '../components/attendance-store'
import { useAttendanceDetail } from '../hooks/use-attendance-detail'
import { useAttendanceLogs } from '../hooks/use-attendance-logs'
import { useAttendanceRequests } from '../hooks/use-attendance-requests'
import { useAttendanceSummary } from '../hooks/use-attendance-summary'
import { useCloseAttendance } from '../hooks/use-close-attendance'
import { attendanceKeys } from '../lib/attendance-query-options'

const DEFAULT_SESSION_ID = 1

function SessionInfoCard() {
  const { data: session, isLoading } = useAttendanceDetail(
    DEFAULT_SESSION_ID,
    true,
  )
  const closeMutation = useCloseAttendance(DEFAULT_SESSION_ID)
  const showConfirmation = useConfirmationStore((state) => state.show)

  const handleClose = () => {
    showConfirmation({
      icon: IconQrcode,
      title: 'Close attendance?',
      description:
        'This will close the current attendance session. Students will no longer be able to scan.',
      actionLabel: 'Close',
      actionVariant: 'destructive',
      onAction: async ({ close, loading }) => {
        loading(true)
        try {
          await closeMutation.mutateAsync()
          close()
        } catch {
          toast.error('Failed to close session.')
        } finally {
          loading(false)
        }
      },
    })
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="sr-only">
          <CardTitle>Active Session</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-4 w-full bg-muted rounded animate-pulse"
              />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!session) return null

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex flex-col gap-1">
          <CardTitle className="text-lg">{session.subject}</CardTitle>
          <CardDescription>
            {session.class_name} · {session.room}
          </CardDescription>
        </div>
        <Badge variant={session.status === 'active' ? 'default' : 'secondary'}>
          {session.status}
        </Badge>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span>{session.start_time}</span>
          <span>—</span>
          <span>{session.end_time}</span>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleClose}
          disabled={session.status !== 'active'}
          className="w-full"
        >
          Close Attendance
        </Button>
      </CardContent>
    </Card>
  )
}

function QrCodeCard() {
  const { data: session } = useAttendanceDetail(DEFAULT_SESSION_ID, true)

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Attendance QR Code</CardTitle>
        <CardDescription>Scan to mark attendance</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-4">
        <div className="flex h-48 w-48 items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted/50">
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <IconQrcode className="size-12" />
            <span className="text-sm">QR Code</span>
          </div>
        </div>
        {session?.status === 'active' && (
          <Button variant="outline" size="sm" className="w-full">
            Generate New QR
          </Button>
        )}
        <div className="text-center text-xs text-muted-foreground">
          <p>Berlaku hingga: {session?.end_time ?? '—'}</p>
        </div>
      </CardContent>
    </Card>
  )
}

function AttendanceStatsCard() {
  const { data: summary, isLoading } = useAttendanceSummary({
    session_id: DEFAULT_SESSION_ID,
  })

  if (isLoading || !summary) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Attendance Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="h-6 w-full bg-muted rounded animate-pulse"
              />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  const stats = [
    {
      label: 'Present',
      count: summary.present_count,
      variant: 'default' as const,
      color: 'text-green-600',
    },
    {
      label: 'Absent',
      count: summary.absent_count,
      variant: 'destructive' as const,
      color: 'text-red-600',
    },
    {
      label: 'Late',
      count: summary.late_count,
      variant: 'secondary' as const,
      color: 'text-yellow-600',
    },
    {
      label: 'Permission',
      count: summary.permission_count,
      variant: 'outline' as const,
      color: 'text-muted-foreground',
    },
  ]

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <IconTrendingUp className="size-4" />
          Attendance Status
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <div className="grid grid-cols-2 gap-3">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col items-center rounded-lg border p-3"
            >
              <span className={`text-2xl font-bold ${stat.color}`}>
                {stat.count}
              </span>
              <span className="text-xs text-muted-foreground">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between rounded-lg bg-muted px-4 py-2">
          <span className="text-sm text-muted-foreground">Total Students</span>
          <span className="text-lg font-bold">{summary.total_students}</span>
        </div>
        <div className="flex items-center justify-between rounded-lg bg-muted px-4 py-2">
          <span className="text-sm text-muted-foreground">Attendance Rate</span>
          <span className="text-lg font-bold text-green-600">
            {summary.percentage}%
          </span>
        </div>
      </CardContent>
    </Card>
  )
}

function AttendanceLogSection() {
  const logsQuery = useAttendanceLogs({ page: 1, per_page: 10, status: 'all' })
  const columns = useAttendanceLogColumns()

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
          </span>
          Real-time Attendance Log
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <DataTable
          columns={columns}
          queryKey={attendanceKeys.logsList({
            page: 1,
            per_page: 10,
            status: 'all',
          })}
          queryFn={() =>
            Promise.resolve({
              items: logsQuery.data?.items ?? [],
              meta: logsQuery.data?.meta ?? {
                page: 1,
                per_page: 10,
                total: 0,
                total_pages: 0,
              },
            })
          }
          allowedSortBy={['created_at']}
          defaultSortBy="created_at"
          defaultOrder="desc"
          searchPlaceholder="Search students..."
          syncWithQueryParams={false}
        />
      </CardContent>
    </Card>
  )
}

function StudentRequestSection() {
  const { activeTab, setActiveTab } = useAttendanceStore()
  const requestsQuery = useAttendanceRequests({
    page: 1,
    per_page: 10,
    status: activeTab === 'all' ? undefined : activeTab,
  })
  const columns = useAttendanceRequestColumns()
  const showConfirmation = useConfirmationStore((state) => state.show)

  const handleApprove = (id: number) => {
    showConfirmation({
      icon: IconQrcode,
      title: 'Approve request?',
      description: 'Approve this student attendance request.',
      actionLabel: 'Approve',
      actionVariant: 'default',
      onAction: async ({ close, loading }) => {
        loading(true)
        try {
          await postApproveAttendanceRequest(id)
          close()
          toast.success('Request approved.')
        } catch {
          toast.error('Failed to approve request.')
        } finally {
          loading(false)
        }
      },
    })
  }

  const handleReject = (id: number) => {
    showConfirmation({
      icon: IconRefresh,
      title: 'Reject request?',
      description: 'Reject this student attendance request.',
      actionLabel: 'Reject',
      actionVariant: 'destructive',
      onAction: async ({ close, loading }) => {
        loading(true)
        try {
          await postRejectAttendanceRequest(id)
          close()
          toast.success('Request rejected.')
        } catch {
          toast.error('Failed to reject request.')
        } finally {
          loading(false)
        }
      },
    })
  }

  const requestColumns: ColumnDef<DataTableFeatures, IAttendanceRequest>[] =
    useMemo(() => {
      const baseCols = columns.filter((c) => c.id !== 'actions')
      const extra: ColumnDef<DataTableFeatures, IAttendanceRequest>[] = [
        {
          id: 'pick_up_person',
          accessorKey: 'pick_up_person',
          header: 'Pick Up',
          cell: ({ row }) => String(row.original.pick_up_person ?? '-'),
          enableSorting: false,
        },
        {
          id: 'supervising_teacher',
          accessorKey: 'supervising_teacher',
          header: 'Supervisor',
          cell: ({ row }) => String(row.original.supervising_teacher ?? '-'),
          enableSorting: false,
        },
        {
          id: 'actions',
          header: 'Action',
          cell: ({ row }) => {
            const item = row.original
            if (item.status !== 'waiting') {
              return <span className="text-muted-foreground text-sm">-</span>
            }
            return (
              <div className="flex gap-1">
                <Button
                  variant="default"
                  size="icon-xs"
                  onClick={() => handleApprove(item.id)}
                  aria-label="Approve"
                >
                  ✓
                </Button>
                <Button
                  variant="destructive"
                  size="icon-xs"
                  onClick={() => handleReject(item.id)}
                  aria-label="Reject"
                >
                  ✕
                </Button>
              </div>
            )
          },
        },
      ]
      return [...baseCols, ...extra]
    }, [columns])

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Student Requests</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {(['waiting', 'approved', 'all'] as const).map((tab) => (
            <Button
              key={tab}
              variant={activeTab === tab ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveTab(tab)}
              className="capitalize"
            >
              {tab === 'waiting'
                ? 'Waiting'
                : tab === 'approved'
                  ? 'Approved'
                  : 'All'}
              <Badge variant="secondary" className="ml-1">
                0
              </Badge>
            </Button>
          ))}
          <div className="flex-1" />
          <Button variant="ghost" size="sm">
            <IconRefresh className="mr-1 size-3" />
            Refresh
          </Button>
        </div>
        <DataTable
          columns={requestColumns}
          queryKey={attendanceKeys.requestsList({
            page: 1,
            per_page: 10,
            status: activeTab === 'all' ? undefined : activeTab,
          })}
          queryFn={() =>
            Promise.resolve({
              items: requestsQuery.data?.items ?? [],
              meta: requestsQuery.data?.meta ?? {
                page: 1,
                per_page: 10,
                total: 0,
                total_pages: 0,
              },
            })
          }
          allowedSortBy={['created_at']}
          defaultSortBy="created_at"
          defaultOrder="desc"
          searchPlaceholder="Search requests..."
          syncWithQueryParams={false}
        />
      </CardContent>
    </Card>
  )
}

function AttendanceContent() {
  return (
    <div className="flex w-full flex-col gap-6 p-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight">Teacher Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Manage and monitor student attendance in real-time.
        </p>
      </div>
      <SessionInfoCard />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <QrCodeCard />
        <AttendanceStatsCard />
      </div>
      <AttendanceLogSection />
      <StudentRequestSection />
    </div>
  )
}

export function AttendanceView() {
  return (
    <AttendanceProvider>
      <AttendanceContent />
    </AttendanceProvider>
  )
}
