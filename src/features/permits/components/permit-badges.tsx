import type { IPermitRecord } from '@/features/permits/types/permit.types'

import { Badge } from '@/components/ui/badge'

export function PermitStatusBadge({
  status,
}: {
  status: IPermitRecord['status']
}) {
  switch (status) {
    case 'approved':
      return (
        <Badge
          variant="outline"
          className="border-green-500 bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300"
        >
          Disetujui
        </Badge>
      )
    case 'pending':
      return (
        <Badge
          variant="outline"
          className="border-yellow-500 bg-yellow-50 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300"
        >
          Menunggu
        </Badge>
      )
    case 'rejected':
      return <Badge variant="destructive">Ditolak</Badge>
    default:
      return <Badge variant="secondary">{status}</Badge>
  }
}

export function PermitTypeBadge({ type }: { type: IPermitRecord['type'] }) {
  switch (type) {
    case 'sick':
      return (
        <Badge
          variant="outline"
          className="border-yellow-500 text-yellow-600 bg-yellow-50/50 dark:bg-yellow-950/50"
        >
          Sakit
        </Badge>
      )
    case 'leave_school':
      return (
        <Badge
          variant="outline"
          className="border-blue-500 text-blue-600 bg-blue-50/50 dark:bg-blue-950/50"
        >
          Keluar Sekolah
        </Badge>
      )
    case 'leave_in':
      return (
        <Badge
          variant="outline"
          className="border-purple-500 text-purple-600 bg-purple-50/50 dark:bg-purple-950/50"
        >
          Izin Masuk
        </Badge>
      )
    default:
      return <Badge variant="outline">{type}</Badge>
  }
}
