import type { IPermitStatistics } from '@/features/permits/types/permit.types'

import {
  IconAlertCircle,
  IconCalendarClock,
  IconClock,
  IconFileCheck,
  IconUserCheck,
} from '@tabler/icons-react'

import { Card, CardContent } from '@/components/ui/card'
import { Typography } from '@/components/ui/typography'

function PermitSummaryCard({
  title,
  value,
  description,
  icon,
  variant = 'default',
}: {
  title: string
  value: string | number
  description: string
  icon: React.ReactNode
  variant?: 'default' | 'success' | 'warning' | 'danger'
}) {
  const borderColors = {
    default: 'border-l-4 border-l-primary',
    success: 'border-l-4 border-l-green-500',
    warning: 'border-l-4 border-l-yellow-500',
    danger: 'border-l-4 border-l-red-500',
  }

  return (
    <Card className={`overflow-hidden shadow-sm ${borderColors[variant]}`}>
      <CardContent className="p-4 sm:p-5">
        <div className="flex items-center justify-between">
          <div>
            <Typography
              as="span"
              variant="muted"
              className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
            >
              {title}
            </Typography>
            <Typography
              as="h3"
              variant="h3"
              className="mt-1 font-bold text-2xl"
            >
              {value}
            </Typography>
            <Typography
              as="p"
              variant="muted"
              className="mt-1 text-xs text-muted-foreground"
            >
              {description}
            </Typography>
          </div>
          <div className="rounded-full bg-muted p-2.5 text-muted-foreground">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function PermitSummaryCards({
  statistics,
}: {
  statistics: IPermitStatistics
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
      <PermitSummaryCard
        title="Total Izin Hari Ini"
        value={statistics.total_today}
        description="Pengajuan hari ini"
        icon={<IconFileCheck className="h-5 w-5" />}
        variant="default"
      />
      <PermitSummaryCard
        title="Menunggu Validasi"
        value={statistics.pending_validation}
        description="Perlu tindakan"
        icon={<IconClock className="h-5 w-5" />}
        variant="warning"
      />
      <PermitSummaryCard
        title="Izin Sakit"
        value={statistics.sick_this_month}
        description="Bulan ini"
        icon={<IconUserCheck className="h-5 w-5" />}
        variant="success"
      />
      <PermitSummaryCard
        title="Izin Keluar"
        value={statistics.leave_school_this_month}
        description="Bulan ini"
        icon={<IconCalendarClock className="h-5 w-5" />}
        variant="default"
      />
      <PermitSummaryCard
        title="Izin Masuk"
        value={statistics.leave_in_this_month}
        description="Bulan ini"
        icon={<IconAlertCircle className="h-5 w-5" />}
        variant="default"
      />
    </div>
  )
}
