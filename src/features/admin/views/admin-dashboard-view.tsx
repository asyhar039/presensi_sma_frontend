import type { ColumnDef } from '@tanstack/react-table'
import type { DataTableFeatures } from '@/components/data-table/data-table'
import type { IAttendanceRecord } from '@/features/attendance/types/attendance.types'

import dayjs from 'dayjs'
import { useMemo } from 'react'

import { DataTable, dataTableHeader } from '@/components/data-table'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useAuth } from '@/context/auth-context'
import { useAdminStats } from '@/features/admin/hooks/use-admin-stats'
import {
  ATTENDANCE_STATUS_BADGE_VARIANTS,
  ATTENDANCE_STATUS_LABELS,
} from '@/features/attendance/types/attendance.types'

function useLiveAttendanceColumns(): ColumnDef<
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
          <span className="font-medium text-muted-foreground">
            {row.original.student?.user?.identity_number}
          </span>
        ),
      },
      {
        id: 'student_name',
        accessorKey: 'student_id',
        header: dataTableHeader('Nama Siswa'),
        cell: ({ row }) => (
          <span className="font-medium">
            {row.original.student?.user?.name}
          </span>
        ),
      },
      {
        id: 'classroom',
        accessorKey: 'classroom_name',
        header: dataTableHeader('Kelas'),
      },
      {
        id: 'subject',
        accessorKey: 'subject_name',
        header: dataTableHeader('Mata Pelajaran'),
      },
      {
        id: 'status',
        accessorKey: 'status',
        header: dataTableHeader('Status'),
        cell: ({ row }) => {
          const status = row.original.status
          const variant = ATTENDANCE_STATUS_BADGE_VARIANTS[status]
          const label = ATTENDANCE_STATUS_LABELS[status]
          return <Badge variant={variant}>{label}</Badge>
        },
      },
      {
        id: 'date',
        accessorKey: 'date',
        header: dataTableHeader('Tanggal'),
        cell: ({ row }) => dayjs(row.original.date).format('DD/MM/YYYY'),
      },
      {
        id: 'time',
        accessorKey: 'time_start',
        header: dataTableHeader('Waktu'),
        cell: ({ row }) =>
          `${row.original.time_start}–${row.original.time_end}`,
      },
    ],
    [],
  )
}

export function AdminDashboardView() {
  const { user } = useAuth()
  const { totalStudents, totalTeachers, attendancePercentage, isLoading } =
    useAdminStats()
  const liveAttendanceColumns = useLiveAttendanceColumns()

  const currentDate = useMemo(() => dayjs().format('dddd, D MMMM YYYY'), [])

  const stats = [
    {
      title: 'Jumlah Siswa',
      value: totalStudents,
      description: 'Total siswa terdaftar',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-950',
    },
    {
      title: 'Jumlah Guru',
      value: totalTeachers,
      description: 'Total guru terdaftar',
      color: 'text-green-600',
      bgColor: 'bg-green-50 dark:bg-green-950',
    },
    {
      title: 'Persentase Kehadiran Hari Ini',
      value: `${attendancePercentage.toFixed(1)}%`,
      description: 'Tingkat kehadiran siswa',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50 dark:bg-purple-950',
    },
    {
      title: 'Mata Pelajaran Aktif',
      value: 10,
      description: 'Sesi pelajaran aktif hari ini',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50 dark:bg-orange-950',
    },
  ]

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">
            Selamat Datang {user?.name ? `, ${user.name}` : ''}
          </h1>
        </div>
        <div className="flex flex-col gap-1">
          <p className="text-sm text-muted-foreground">{user?.name}</p>
          <p className="text-sm text-muted-foreground">{currentDate}</p>
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`rounded-lg ${stat.bgColor} p-4`}>
                <div className={`text-3xl font-bold ${stat.color}`}>
                  {isLoading ? <Skeleton className="h-10 w-24" /> : stat.value}
                </div>
                <p className="text-xs text-muted-foreground pt-2">
                  {stat.description}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Section */}
      <div className="space-y-4">
        {/* Live Attendance Table */}
        <Card>
          <CardHeader>
            <CardTitle>Kehadiran Langsung</CardTitle>
            <CardDescription>Status kehadiran siswa saat ini</CardDescription>
          </CardHeader>
          <CardContent>
            <DataTable
              columns={liveAttendanceColumns}
              queryKey={['live-attendance']}
              queryFn={async (params) => {
                const { getAttendanceRecords } = await import(
                  '@/features/attendance/services/attendance-api'
                )
                return getAttendanceRecords({
                  page: params.page ? Number(params.page) : 1,
                  per_page: params.per_page ? Number(params.per_page) : 10,
                  search: params.search ? String(params.search) : undefined,
                })
              }}
              defaultOrder="desc"
              perPageOptions={[10, 20, 50]}
              searchPlaceholder="Cari NIS atau nama siswa..."
              emptyTitle="Tidak ada data kehadiran"
              emptyDescription="Tidak ada siswa yang hadir saat ini."
              syncWithQueryParams={false}
            />
          </CardContent>
        </Card>

        {/* Attendance Composition */}
        <Card>
          <CardHeader>
            <CardTitle>Komposisi Kehadiran</CardTitle>
            <CardDescription>Persentase status kehadiran</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Hadir</span>
                  <span className="font-semibold">91.0%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                  <div
                    className="bg-green-500 h-2 rounded-full"
                    style={{ width: '91%' }}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Izin</span>
                  <span className="font-semibold">4.5%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                  <div
                    className="bg-yellow-500 h-2 rounded-full"
                    style={{ width: '4.5%' }}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Sakit</span>
                  <span className="font-semibold">3.0%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                  <div
                    className="bg-orange-500 h-2 rounded-full"
                    style={{ width: '3%' }}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Alpa</span>
                  <span className="font-semibold">1.5%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                  <div
                    className="bg-red-500 h-2 rounded-full"
                    style={{ width: '1.5%' }}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
