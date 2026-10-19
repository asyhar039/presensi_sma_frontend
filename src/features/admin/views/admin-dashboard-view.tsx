import type {
  AttendanceStatus,
  IAttendanceParams,
} from '@/features/attendance/types/attendance.types'

import dayjs from 'dayjs'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { DataTable } from '@/components/data-table'
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
import { useAttendanceColumns } from '@/features/attendance/components/attendance-columns'
import { attendanceKeys } from '@/features/attendance/lib/attendance-query-options'
import {
  ATTENDANCE_DEFAULT_FILTERS,
  ATTENDANCE_DEFAULT_ORDER,
  ATTENDANCE_DEFAULT_SORT_BY,
  ATTENDANCE_PER_PAGE_OPTIONS,
  ATTENDANCE_SORT_BY,
  attendanceFilterSchema,
} from '@/features/attendance/lib/attendance-table'
import { getAttendanceRecords } from '@/features/attendance/services/attendance-api'

export function AdminDashboardView() {
  const { t } = useTranslation()
  const { user } = useAuth()

  const { totalStudents, totalTeachers, attendancePercentage, isLoading } =
    useAdminStats()

  const columns = useAttendanceColumns()

  const currentDate = useMemo(() => dayjs().format('dddd, D MMMM YYYY'), [])

  const stats = [
    {
      title: t('adminDashboard.totalStudents'),
      value: totalStudents,
      description: t('adminDashboard.totalStudentsDesc'),
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-950',
    },
    {
      title: t('adminDashboard.totalTeachers'),
      value: totalTeachers,
      description: t('adminDashboard.totalTeachersDesc'),
      color: 'text-green-600',
      bgColor: 'bg-green-50 dark:bg-green-950',
    },
    {
      title: t('adminDashboard.attendancePercentage'),
      value: `${attendancePercentage.toFixed(1)}%`,
      description: t('adminDashboard.attendancePercentageDesc'),
      color: 'text-purple-600',
      bgColor: 'bg-purple-50 dark:bg-purple-950',
    },
    {
      title: t('adminDashboard.activeSubjects'),
      value: 10,
      description: t('adminDashboard.activeSubjectsDesc'),
      color: 'text-orange-600',
      bgColor: 'bg-orange-50 dark:bg-orange-950',
    },
  ]

  return (
    <div className="flex w-full flex-col gap-6">
      {/* Header Dashboard */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">
            {t('adminDashboard.welcome')} {user?.name ? `, ${user.name}` : ''}
          </h1>
        </div>

        <div className="flex flex-col gap-1">
          <p className="text-sm text-muted-foreground">{user?.name}</p>
          <p className="text-sm text-muted-foreground">{currentDate}</p>
        </div>
      </div>

      {/* Statistik Dashboard */}
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

                <p className="pt-2 text-xs text-muted-foreground">
                  {stat.description}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tabel Presensi dan Komposisi Kehadiran */}
      <div className="grid items-start gap-6 lg:grid-cols-12">
        {/* Live Presensi Siswa */}
        <div className="space-y-6 lg:col-span-8">
          <Card>
            <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="space-y-1">
                <CardTitle className="flex items-center gap-2">
                  <span className="size-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  {t('adminDashboard.liveAttendance')}
                </CardTitle>

                <CardDescription>
                  {t('adminDashboard.liveAttendanceDesc')}
                </CardDescription>
              </div>

              <div className="flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                {t('adminDashboard.realtimeUpdate')}
              </div>
            </CardHeader>

            <CardContent>
              <DataTable
                columns={columns}
                queryKey={attendanceKeys.lists()}
                queryFn={async (params) => {
                  const apiParams: IAttendanceParams = {}

                  if (params.classroom_id) {
                    apiParams.classroom_id = Number(params.classroom_id)
                  }

                  if (params.month) {
                    apiParams.month = Number(params.month)
                  }

                  if (params.semester) {
                    apiParams.semester = String(params.semester)
                  }

                  if (params.status && params.status !== 'all') {
                    apiParams.status = params.status as AttendanceStatus
                  }

                  if (params.search) {
                    apiParams.search = String(params.search)
                  }

                  if (params.page) {
                    apiParams.page = Number(params.page)
                  }

                  if (params.per_page) {
                    apiParams.per_page = Number(params.per_page)
                  }

                  if (params.sortBy) {
                    apiParams.sortBy = String(params.sortBy)
                  }

                  if (params.order) {
                    apiParams.order = String(params.order)
                  }

                  return getAttendanceRecords(apiParams)
                }}
                allowedSortBy={ATTENDANCE_SORT_BY}
                defaultSortBy={ATTENDANCE_DEFAULT_SORT_BY}
                defaultOrder={ATTENDANCE_DEFAULT_ORDER}
                perPageOptions={ATTENDANCE_PER_PAGE_OPTIONS}
                defaultFilters={ATTENDANCE_DEFAULT_FILTERS}
                filterSchema={attendanceFilterSchema}
                enableSearch={false}
                toolbar={null}
                footer={null}
                emptyTitle={t('adminDashboard.noAttendanceData')}
                emptyDescription={t('adminDashboard.noAttendanceActivity')}
                errorMessage={t('adminDashboard.failedLoadAttendance')}
                syncWithQueryParams
              />
            </CardContent>
          </Card>
        </div>

        {/* Komposisi Kehadiran */}
        <div className="space-y-6 lg:col-span-4">
          <Card>
            <CardHeader>
              <CardTitle>{t('adminDashboard.attendanceComposition')}</CardTitle>
              <CardDescription>
                {t('adminDashboard.attendanceCompositionDesc')}
              </CardDescription>
            </CardHeader>

            <CardContent>
              <div className="space-y-4">
                {/* Hadir */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>{t('adminDashboard.present')}</span>
                    <span className="font-semibold">91.0%</span>
                  </div>

                  <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700">
                    <div
                      className="h-2 rounded-full bg-green-500"
                      style={{ width: '91%' }}
                    />
                  </div>
                </div>

                {/* Izin */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>{t('adminDashboard.permission')}</span>
                    <span className="font-semibold">4.5%</span>
                  </div>

                  <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700">
                    <div
                      className="h-2 rounded-full bg-yellow-500"
                      style={{ width: '4.5%' }}
                    />
                  </div>
                </div>

                {/* Sakit */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>{t('adminDashboard.sick')}</span>
                    <span className="font-semibold">3.0%</span>
                  </div>

                  <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700">
                    <div
                      className="h-2 rounded-full bg-orange-500"
                      style={{ width: '3%' }}
                    />
                  </div>
                </div>

                {/* Alpa */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>{t('adminDashboard.absent')}</span>
                    <span className="font-semibold">1.5%</span>
                  </div>

                  <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700">
                    <div
                      className="h-2 rounded-full bg-red-500"
                      style={{ width: '1.5%' }}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
