import type {
  IAttendanceSummary,
  IStudentAttendanceSummary,
} from '@/features/attendance/types/attendance.types'

import { Card, CardContent } from '@/components/ui/card'
import { Typography } from '@/components/ui/typography'

interface SummaryCardProps {
  title: string
  value: string | number
  description?: string
  icon?: React.ReactNode
  variant?: 'default' | 'success' | 'warning' | 'danger'
  className?: string
}

function SummaryCard({
  title,
  value,
  description,
  icon,
  variant = 'default',
  className,
}: SummaryCardProps) {
  const variantClasses = {
    default: 'border-l-4 border-primary',
    success: 'border-l-4 border-green-500',
    warning: 'border-l-4 border-yellow-500',
    danger: 'border-l-4 border-red-500',
  }

  return (
    <Card
      className={`${variantClasses[variant]} transition-shadow hover:shadow-md ${className || ''}`}
    >
      <CardContent className="pt-6">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <Typography
              as="p"
              variant="small"
              className="text-muted-foreground"
            >
              {title}
            </Typography>
            <Typography as="h3" variant="h3" className="mt-1 font-bold">
              {value}
            </Typography>
            {description && (
              <Typography
                as="p"
                variant="muted"
                className="mt-1 text-muted-foreground"
              >
                {description}
              </Typography>
            )}
          </div>
          {icon && (
            <div className="flex-shrink-0 text-muted-foreground/50">{icon}</div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export function AttendanceSummaryCards({
  summary,
}: {
  summary: IAttendanceSummary
}) {
  const attendanceRate = summary.average_attendance.toFixed(1)
  const totalRecords =
    summary.total_present +
    summary.total_permission +
    summary.total_sick +
    summary.total_absent

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <SummaryCard
        title="Total Siswa"
        value={summary.total_students}
        description="Siswa di kelas ini"
        variant="default"
      />
      <SummaryCard
        title="Rata-rata Kehadiran"
        value={`${attendanceRate}%`}
        description={`Dari ${totalRecords} total pertemuan`}
        variant="success"
      />
      <SummaryCard
        title="Total Izin & Sakit"
        value={summary.total_permission + summary.total_sick}
        description={`Izin: ${summary.total_permission} | Sakit: ${summary.total_sick}`}
        variant="warning"
      />
      <SummaryCard
        title="Total Alpa"
        value={summary.total_absent}
        description="Tanpa keterangan"
        variant="danger"
      />
    </div>
  )
}

export function StudentAttendanceSummaryCards({
  summary,
}: {
  summary: IStudentAttendanceSummary
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <SummaryCard
        title="HADIR"
        value={summary.present}
        variant="success"
        className="bg-green-500/10 border-none"
      />
      <SummaryCard
        title="IZIN"
        value={summary.permission}
        variant="default"
        className="bg-blue-500/10 border-none"
      />
      <SummaryCard
        title="SAKIT"
        value={summary.sick}
        variant="warning"
        className="bg-yellow-500/10 border-none"
      />
      <SummaryCard
        title="ALFA"
        value={summary.absent}
        variant="danger"
        className="bg-red-500/10 border-none"
      />
    </div>
  )
}
