import { IconFilter, IconSearch } from '@tabler/icons-react'
import { useState } from 'react'
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
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useAuth } from '@/context/auth-context'
import {
  type SessionRow,
  useAttendanceHistoryColumns,
} from '../components/attendance-history-columns'
import { useAttendanceLogs } from '../hooks/use-attendance-logs'
import { useAttendanceSessions } from '../hooks/use-attendance-sessions'
import { attendanceKeys } from '../lib/attendance-query-options'

const PAGE_SIZE = 10

function convertSessionsToRows(
  sessions: Array<{
    id: number
    created_at: string
    start_time: string
    end_time: string
    subject: string
    status: string
  }>,
): SessionRow[] {
  return sessions.map((s) => ({
    id: s.id,
    date: s.created_at
      ? new Date(s.created_at).toLocaleDateString('id-ID', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        })
      : '-',
    time: `${s.start_time} - ${s.end_time}`,
    subject: s.subject,
    present: 0,
    absent: 0,
    late: 0,
    permission: 0,
    status: s.status,
    session_id: s.id,
  }))
}

function getStudentsNeedingAttention(
  logs: Array<{
    student: { name: string; identity_number: string }
    status: string
  }>,
): Array<{
  name: string
  identity_number: string
  alfa: number
  sakit: number
  izin: number
}> {
  const studentMap = new Map<
    string,
    {
      name: string
      identity_number: string
      alfa: number
      sakit: number
      izin: number
    }
  >()

  for (const log of logs) {
    const key = log.student.name
    if (!studentMap.has(key)) {
      studentMap.set(key, {
        name: log.student.name,
        identity_number: log.student.identity_number,
        alfa: 0,
        sakit: 0,
        izin: 0,
      })
    }
    const s = studentMap.get(key)
    if (!s) continue
    const status = log.status.toLowerCase()
    if (status === 'absent') s.alfa++
    else if (status === 'permission') s.izin++
    else if (status === 'late') s.sakit++
  }

  return Array.from(studentMap.values())
    .filter((s) => s.alfa >= 2 || s.sakit >= 3 || s.izin >= 2)
    .sort((a, b) => b.alfa + b.sakit + b.izin - (a.alfa + a.sakit + a.izin))
    .slice(0, 5)
}

function AttendanceHistoryContent() {
  const { user } = useAuth()
  const teacherId = user ? Number(user.id) : null

  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const sessionsQuery = useAttendanceSessions({
    page: 1,
    per_page: PAGE_SIZE,
    teacher_id: teacherId ?? undefined,
    search: search || undefined,
    status: statusFilter !== 'all' ? statusFilter : undefined,
    sortBy: 'created_at',
    order: 'desc',
  })

  const logsQuery = useAttendanceLogs({
    page: 1,
    per_page: PAGE_SIZE,
    teacher_id: teacherId ?? undefined,
    search: search || undefined,
  })

  const sessions = sessionsQuery.data?.items ?? []
  const sessionsMeta = sessionsQuery.data?.meta
  const totalSessions = sessionsMeta?.total ?? 0
  const closedSessions = sessions.filter((s) => s.status === 'closed').length

  const logs = logsQuery.data?.items ?? []
  const sessionRows = convertSessionsToRows(sessions)

  const totalPresent = logs.filter((l) => l.status === 'present').length
  const totalAll = logs.length
  const averageAttendance =
    totalAll > 0 ? Math.round((totalPresent / totalAll) * 100) : 0

  const attentionStudents = getStudentsNeedingAttention(logs)

  const columns = useAttendanceHistoryColumns({
    onSessionClick: (sessionId: number) => {
      toast.info(`Melihat detail sesi #${sessionId}`)
    },
  })

  return (
    <div className="flex w-full flex-col gap-6 p-6">
      {/* Page Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight">
          Attendance History
        </h1>
        <p className="text-sm text-muted-foreground">
          View and manage your previous attendance sessions.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              RATA-RATA KEHADIRAN
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold">
                {averageAttendance > 0 ? `${averageAttendance}%` : '-'}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {totalAll > 0
                ? `Dari ${totalAll} catatan`
                : 'Data belum tersedia'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              TOTAL SESI DIAJARKAN
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold">
                {totalSessions > 0 ? totalSessions : '-'}
              </span>
              <span className="text-sm text-muted-foreground">Pertemuan</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {closedSessions > 0
                ? `${closedSessions} sudah ditutup`
                : totalSessions > 0
                  ? 'Sesi aktif berjalan'
                  : 'Belum ada sesi'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              PERLU PERHATIAN KHUSUS
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold">
                {attentionStudents.length > 0 ? attentionStudents.length : '-'}
              </span>
              <span className="text-sm text-muted-foreground">siswa</span>
            </div>
            {attentionStudents.length > 0 && (
              <div className="mt-2 space-y-1">
                {attentionStudents.slice(0, 3).map((s, i) => (
                  <p key={i} className="text-[10px] text-muted-foreground">
                    {s.name} - {s.alfa} A, {s.sakit} S, {s.izin} I
                  </p>
                ))}
              </div>
            )}
            <p className="text-xs text-muted-foreground mt-1">
              {attentionStudents.length > 0
                ? 'Klik untuk detail'
                : 'Semua siswa aktif'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Session Log Section */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
            </span>
            Log Pertemuan
          </CardTitle>
          <CardDescription>
            Riwayat sesi attendance yang sudah diajarkan
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <DataTable<SessionRow>
            columns={columns}
            queryKey={attendanceKeys.list({
              page: 1,
              per_page: PAGE_SIZE,
              teacher_id: teacherId ?? undefined,
            })}
            queryFn={() =>
              Promise.resolve({
                items: sessionRows,
                meta: sessionsMeta ?? {
                  page: 1,
                  per_page: PAGE_SIZE,
                  total: totalSessions,
                  total_pages: Math.ceil(totalSessions / PAGE_SIZE),
                },
              })
            }
            allowedSortBy={['created_at']}
            defaultSortBy="created_at"
            defaultOrder="desc"
            searchPlaceholder="Search date or topic..."
            syncWithQueryParams={false}
          />
        </CardContent>
      </Card>

      {/* Student Recap */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Rekapitulasi Siswa</CardTitle>
          <CardDescription>
            Total:{' '}
            {logs.length > 0
              ? new Set(logs.map((l) => l.student.name)).size
              : 0}{' '}
            Siswa
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {logs.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Tidak ada data siswa tersedia.
              </p>
            ) : (
              Array.from(
                new Map(
                  logs.map((log) => [
                    log.student.name,
                    {
                      name: log.student.name,
                      identity_number: log.student.identity_number,
                      count: log.status === 'present' ? 1 : 0,
                    },
                  ]),
                ).values(),
              )
                .sort((a, b) => b.count - a.count)
                .slice(0, 10)
                .map((student, i) => (
                  <div
                    key={student.name}
                    className="flex items-center justify-between rounded-lg border p-3"
                  >
                    <div>
                      <p className="text-sm font-medium">
                        {i + 1}. {student.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        NIS: {student.identity_number}
                      </p>
                    </div>
                    <Badge variant="default">
                      {student.count > 0
                        ? `${Math.round((student.count / Math.max(1, logs.length)) * 100)}%`
                        : '-'}
                    </Badge>
                  </div>
                ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Search and Filter Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 gap-2">
          <div className="relative flex-1 max-w-sm">
            <IconSearch className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search date or topic..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select
            value={statusFilter}
            onValueChange={(v) => setStatusFilter(v ?? 'all')}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="scheduled">Scheduled</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <IconFilter className="mr-1 size-4" />
            Filter
          </Button>
        </div>
      </div>
    </div>
  )
}

export function AttendanceHistoryView() {
  return <AttendanceHistoryContent />
}
