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
  const {
    totalStudents,
    totalTeachers,
    totalSubjects,
    totalClassrooms,
    attendanceReport,
    loading,
    errors,
  } = useAdminStats()
  const columns = useAttendanceColumns()

  const currentDate = useMemo(() => dayjs().format('dddd, D MMMM YYYY'), [])

  const stats = [
    {
      title: t('adminDashboard.totalStudents'),
      value: errors.students ? null : totalStudents,
      isLoading: loading.students,
      hasError: errors.students,
      description: t('adminDashboard.totalStudentsDesc'),
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-950',
    },
    {
      title: t('adminDashboard.totalTeachers'),
      value: errors.teachers ? null : totalTeachers,
      isLoading: loading.teachers,
      hasError: errors.teachers,
      description: t('adminDashboard.totalTeachersDesc'),
      color: 'text-green-600',
      bgColor: 'bg-green-50 dark:bg-green-950',
    },
    {
      title: t('adminDashboard.attendancePercentage'),
      value: errors.attendanceReport
        ? null
        : attendanceReport
          ? `${attendanceReport.average_attendance.toFixed(1)}%`
          : null,
      isLoading: loading.attendanceReport,
      hasError: errors.attendanceReport,
      description: t('adminDashboard.attendancePercentageDesc'),
      color: 'text-purple-600',
      bgColor: 'bg-purple-50 dark:bg-purple-950',
    },
    {
      title: t('adminDashboard.totalSubjects'),
      value: errors.subjects ? null : totalSubjects,
      isLoading: loading.subjects,
      hasError: errors.subjects,
      description: t('adminDashboard.totalSubjectsDesc'),
      color: 'text-orange-600',
      bgColor: 'bg-orange-50 dark:bg-orange-950',
    },
    {
      title: t('adminDashboard.totalClassrooms'),
      value: errors.classrooms ? null : totalClassrooms,
      isLoading: loading.classrooms,
      hasError: errors.classrooms,
      description: t('adminDashboard.totalClassroomsDesc'),
      color: 'text-cyan-600',
      bgColor: 'bg-cyan-50 dark:bg-cyan-950',
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

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
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
                  {stat.isLoading ? (
                    <Skeleton className="h-10 w-24" />
                  ) : (
                    (stat.value ?? '—')
                  )}
                </div>
                <p className="text-xs text-muted-foreground pt-2">
                  {stat.hasError
                    ? t('adminDashboard.failedLoadData')
                    : stat.description}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

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
  )
}
