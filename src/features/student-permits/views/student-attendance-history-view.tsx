import type { ColumnDef } from '@tanstack/react-table'
import type { DataTableFeatures } from '@/components/data-table/data-table'
import type {
  IStudentAttendanceRecord,
  StudentAttendanceStatus,
} from '@/features/student-permits/types/attendance-history.types'

import { IconArrowLeft, IconDownload } from '@tabler/icons-react'
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { useState } from 'react'

import { DataTable } from '@/components/data-table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Typography } from '@/components/ui/typography'
import {
  studentAttendanceHistoryQueryOptions,
  studentAttendanceSummaryQueryOptions,
} from '@/features/student-permits/lib/attendance-history-query-options'
import { cn } from '@/lib/class-name'
import { formatDate } from '@/utils/datetime'

const STATUS_BADGE_VARIANTS: Record<StudentAttendanceStatus, string> = {
  present:
    'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  sick: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  leave_school:
    'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  leave_in:
    'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  absent: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
}

const MOCK_STUDENT = {
  name: 'Andi',
  identity_number: '3040507012',
  classroom_name: 'XI IPA 1',
  homeroom_teacher: 'Dra. Siti Aminah',
}

const DAYS_IN_INDONESIAN = [
  'Minggu',
  'Senin',
  'Selasa',
  'Rabu',
  'Kamis',
  'Jumat',
  'Sabtu',
]

function getDayName(dateStr: string): string {
  const date = new Date(dateStr)
  return DAYS_IN_INDONESIAN[date.getDay()]
}

export function StudentAttendanceHistoryView() {
  const { data: summary } = useQuery(studentAttendanceSummaryQueryOptions())
  const [statusFilter, setStatusFilter] = useState('all')
  const [monthFilter, setMonthFilter] = useState('')
  const navigate = useNavigate()

  const handleStatusChange = (value: string | null) => {
    const val = value ?? 'all'
    setStatusFilter(val)
  }

  const handleMonthChange = (value: string | null) => {
    const val = value ?? ''
    setMonthFilter(val)
  }

  const { data: history } = useQuery(
    studentAttendanceHistoryQueryOptions({
      status: statusFilter === 'all' ? undefined : statusFilter,
      month: monthFilter || undefined,
    }),
  )

  const handleBackToDashboard = () => {
    navigate({ to: '/dashboard', replace: true })
  }

  const renderStatusBadge = (
    status: StudentAttendanceStatus,
    label: string,
  ) => (
    <Badge className={cn('capitalize', STATUS_BADGE_VARIANTS[status])}>
      {label}
    </Badge>
  )

  const renderAttachment = (url: string | null) => {
    if (!url) return <span className="text-muted-foreground italic">-</span>
    return (
      <Button
        variant="ghost"
        size="sm"
        onClick={() => window.open(url, '_blank')}
      >
        <IconDownload className="h-4 w-4 mr-1" />
        Lihat
      </Button>
    )
  }

  const columns: ColumnDef<
    DataTableFeatures,
    IStudentAttendanceRecord,
    unknown
  >[] = [
    {
      id: 'date',
      header: 'Tanggal & Hari',
      accessorKey: 'date',
      cell: ({ row }) => (
        <div>
          <Typography className="font-medium">
            {formatDate(row.original.date, 'DD MMM YYYY')}
          </Typography>
          <Typography variant="muted" className="text-xs">
            {getDayName(row.original.date)}
          </Typography>
        </div>
      ),
    },
    {
      id: 'time',
      header: 'Jam Masuk / Pulang',
      cell: ({ row }) => (
        <div className="space-y-1 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <span>Masuk:</span>
            <Typography className="font-medium">
              {row.original.check_in_time || '-'}
            </Typography>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <span>Pulang:</span>
            <Typography className="font-medium">
              {row.original.check_out_time || '-'}
            </Typography>
          </div>
        </div>
      ),
    },
    {
      id: 'status',
      header: 'Status',
      cell: ({ row }) =>
        renderStatusBadge(row.original.status, row.original.status_label),
    },
    {
      id: 'remarks',
      header: 'Keterangan',
      cell: ({ row }) => (
        <Typography variant="muted" className="max-w-xs truncate block">
          {row.original.remarks || '-'}
        </Typography>
      ),
    },
    {
      id: 'attachment',
      header: 'Lampiran',
      cell: ({ row }) => (
        <div className="flex justify-center">
          {renderAttachment(row.original.document_url)}
        </div>
      ),
    },
  ]

  return (
    <div className="min-h-screen bg-muted/30 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <Typography as="h1" variant="h2" className="text-foreground">
              Riwayat Presensi Siswa
            </Typography>
            <Typography variant="muted" className="text-sm">
              Lihat riwayat kehadiran dan izin Anda
            </Typography>
          </div>
          <Button variant="outline" onClick={handleBackToDashboard}>
            <IconArrowLeft className="h-4 w-4 mr-2" />
            Kembali
          </Button>
        </div>

        {/* Student Profile Card */}
        <Card>
          <CardHeader>
            <CardTitle>Data Siswa</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <div>
                <Typography variant="muted" className="text-xs">
                  Nama
                </Typography>
                <Typography className="font-medium">
                  {MOCK_STUDENT.name}
                </Typography>
              </div>
              <div>
                <Typography variant="muted" className="text-xs">
                  NISN
                </Typography>
                <Typography className="font-medium">
                  {MOCK_STUDENT.identity_number}
                </Typography>
              </div>
              <div>
                <Typography variant="muted" className="text-xs">
                  Kelas
                </Typography>
                <Typography className="font-medium">
                  {MOCK_STUDENT.classroom_name}
                </Typography>
              </div>
              <div>
                <Typography variant="muted" className="text-xs">
                  Wali Kelas
                </Typography>
                <Typography className="font-medium">
                  {MOCK_STUDENT.homeroom_teacher}
                </Typography>
              </div>
            </div>

            {summary && (
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3 pt-4 border-t">
                <div className="text-center p-3 rounded-lg bg-green-50 dark:bg-green-950/20">
                  <Typography className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {summary.total_present}
                  </Typography>
                  <Typography variant="muted" className="text-xs">
                    Hadir
                  </Typography>
                </div>
                <div className="text-center p-3 rounded-lg bg-blue-50 dark:bg-blue-950/20">
                  <Typography className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {summary.total_sick}
                  </Typography>
                  <Typography variant="muted" className="text-xs">
                    Sakit
                  </Typography>
                </div>
                <div className="text-center p-3 rounded-lg bg-amber-50 dark:bg-amber-950/20">
                  <Typography className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                    {summary.total_leave_in}
                  </Typography>
                  <Typography variant="muted" className="text-xs">
                    Terlambat
                  </Typography>
                </div>
                <div className="text-center p-3 rounded-lg bg-blue-50 dark:bg-blue-950/20">
                  <Typography className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {summary.total_leave_school}
                  </Typography>
                  <Typography variant="muted" className="text-xs">
                    Izin Keluar
                  </Typography>
                </div>
                <div className="text-center p-3 rounded-lg bg-red-50 dark:bg-red-950/20">
                  <Typography className="text-2xl font-bold text-red-600 dark:text-red-400">
                    {summary.total_absent}
                  </Typography>
                  <Typography variant="muted" className="text-xs">
                    Alpa
                  </Typography>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Filter Controls */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 sm:w-48">
                <Typography variant="muted" className="text-xs mb-1">
                  Filter Bulan
                </Typography>
                <Select value={monthFilter} onValueChange={handleMonthChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Semua Bulan" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Semua Bulan</SelectItem>
                    <SelectItem value="2026-09">September 2026</SelectItem>
                    <SelectItem value="2026-08">Agustus 2026</SelectItem>
                    <SelectItem value="2026-07">Juli 2026</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1 sm:w-48">
                <Typography variant="muted" className="text-xs mb-1">
                  Filter Status
                </Typography>
                <Select value={statusFilter} onValueChange={handleStatusChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Semua Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua</SelectItem>
                    <SelectItem value="present">Hadir</SelectItem>
                    <SelectItem value="sick">Sakit</SelectItem>
                    <SelectItem value="leave_school">Izin Keluar</SelectItem>
                    <SelectItem value="leave_in">Izin Terlambat</SelectItem>
                    <SelectItem value="absent">Alpa</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Attendance History Table - Using DataTable with pagination */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Riwayat Presensi
              <span className="text-sm text-muted-foreground">
                {history?.items.length ?? 0} data
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <DataTable
              columns={columns}
              queryKey={[
                'student-attendance',
                'history',
                statusFilter,
                monthFilter,
              ]}
              queryFn={async () => {
                const response = await history
                return {
                  items: response?.items ?? [],
                  meta: {
                    page: 1,
                    per_page: 10,
                    total: response?.items.length ?? 0,
                    total_pages: 1,
                  },
                }
              }}
              defaultPerPage={10}
              perPageOptions={[10, 20, 50]}
              enableSearch={false}
              syncWithQueryParams={false}
              emptyTitle="Tidak ada data"
              emptyDescription="Riwayat presensi tidak ditemukan untuk filter ini."
              errorMessage="Gagal memuat data riwayat presensi"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
