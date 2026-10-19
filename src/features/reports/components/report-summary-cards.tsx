import type { IAttendanceReportSummary } from '@/features/reports/types/report.types'

import {
  IconCalendar,
  IconChartBar,
  IconLoader2,
  IconSchool,
  IconUserExclamation,
} from '@tabler/icons-react'
import { useTranslation } from 'react-i18next'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface ReportSummaryCardsProps {
  summary: IAttendanceReportSummary | null
  isLoading: boolean
}

export function ReportSummaryCards({
  summary,
  isLoading,
}: ReportSummaryCardsProps) {
  const { t } = useTranslation()

  const effectiveDays = summary?.effective_days ?? 22
  const averageAttendance = summary?.average_attendance ?? 0
  const chronicAbsent = summary?.chronic_absent_count ?? 0
  const bestClass =
    summary?.best_classroom?.name ?? summary?.best_classroom_name ?? '-'
  const bestClassRate =
    summary?.best_classroom?.attendance_rate ?? summary?.best_classroom_rate

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {/* Effective Days */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            {t('reports.effectiveDays')}
          </CardTitle>
          <IconCalendar className="size-4 text-blue-600" />
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="h-8 flex items-center">
              <IconLoader2 className="size-5 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="text-2xl font-bold">
              {effectiveDays} {t('schedules.day')}
            </div>
          )}
          <p className="text-xs text-muted-foreground pt-1">
            {t('attendance.selectMonthYear')}
          </p>
        </CardContent>
      </Card>

      {/* Average Attendance */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            {t('reports.averageAttendance')}
          </CardTitle>
          <IconChartBar className="size-4 text-emerald-600" />
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="h-8 flex items-center">
              <IconLoader2 className="size-5 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="text-2xl font-bold text-emerald-600">
              {averageAttendance > 0
                ? `${averageAttendance.toFixed(1)}%`
                : '0%'}
            </div>
          )}
          <p className="text-xs text-muted-foreground pt-1">
            {t('attendance.attendancePercentage')}
          </p>
        </CardContent>
      </Card>

      {/* Chronic Absent */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            {t('adminDashboard.absent')} (&gt;3 {t('schedules.day')})
          </CardTitle>
          <IconUserExclamation className="size-4 text-red-600" />
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="h-8 flex items-center">
              <IconLoader2 className="size-5 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="text-2xl font-bold text-red-600">
              {chronicAbsent} {t('students.title')}
            </div>
          )}
          <p className="text-xs text-muted-foreground pt-1">
            {t('dutyTeacher.studentStatus')}
          </p>
        </CardContent>
      </Card>

      {/* Best Classroom */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            {t('classrooms.title')}
          </CardTitle>
          <IconSchool className="size-4 text-purple-600" />
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="h-8 flex items-center">
              <IconLoader2 className="size-5 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="text-2xl font-bold">{bestClass}</div>
          )}
          <p className="text-xs text-muted-foreground pt-1">
            {t('attendance.attendancePercentage')}
            {bestClassRate != null ? ` (${bestClassRate.toFixed(1)}%)` : ''}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
