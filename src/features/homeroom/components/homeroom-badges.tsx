import { Badge } from '@/components/ui/badge'

type LeaveKeyBadgeProps = {
  value: string
  label?: string
}

export function HomeroomTypeBadge({ value, label }: LeaveKeyBadgeProps) {
  if (value === 'sick_leave')
    return (
      <Badge
        variant="outline"
        className="border-yellow-500 text-yellow-600 bg-yellow-50/50 dark:bg-yellow-950/50"
      >
        {label ?? 'Sick Leave'}
      </Badge>
    )
  if (value === 'early_out')
    return (
      <Badge
        variant="outline"
        className="border-blue-500 text-blue-600 bg-blue-50/50 dark:bg-blue-950/50"
      >
        {label ?? 'Early Out'}
      </Badge>
    )
  if (value === 'late_arrival')
    return (
      <Badge
        variant="outline"
        className="border-purple-500 text-purple-600 bg-purple-50/50 dark:bg-purple-950/50"
      >
        {label ?? 'Late Arrival'}
      </Badge>
    )
  return <Badge variant="outline">{label ?? value}</Badge>
}

export function HomeroomStatusBadge({ value, label }: LeaveKeyBadgeProps) {
  if (value === 'approved')
    return (
      <Badge
        variant="outline"
        className="border-green-500 bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300"
      >
        {label ?? 'Approved'}
      </Badge>
    )
  if (value === 'pending')
    return (
      <Badge
        variant="outline"
        className="border-yellow-500 bg-yellow-50 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300"
      >
        {label ?? 'Pending'}
      </Badge>
    )
  if (value === 'rejected')
    return <Badge variant="destructive">{label ?? 'Rejected'}</Badge>
  return <Badge variant="secondary">{label ?? value}</Badge>
}
