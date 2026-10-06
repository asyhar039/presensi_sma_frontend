import { Badge } from '@/components/ui/badge'

export function DutyStatusBadge({ statusKey }: { statusKey: string }) {
  const key = statusKey.toLowerCase()
  if (key === 'approved')
    return (
      <Badge
        variant="outline"
        className="border-green-500 bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300"
      >
        Approved
      </Badge>
    )
  if (key === 'pending')
    return (
      <Badge
        variant="outline"
        className="border-yellow-500 bg-yellow-50 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300"
      >
        Pending
      </Badge>
    )
  if (key === 'rejected') return <Badge variant="destructive">Rejected</Badge>
  return <Badge variant="secondary">{statusKey}</Badge>
}

export function DutyTypeBadge({
  typeKey,
  label,
}: {
  typeKey: string
  label: string
}) {
  const key = typeKey.toLowerCase()
  if (key.includes('early'))
    return (
      <Badge
        variant="outline"
        className="border-blue-500 bg-blue-50/50 text-blue-600 dark:bg-blue-950/50"
      >
        {label}
      </Badge>
    )
  return (
    <Badge
      variant="outline"
      className="border-purple-500 bg-purple-50/50 text-purple-600 dark:bg-purple-950/50"
    >
      {label}
    </Badge>
  )
}
