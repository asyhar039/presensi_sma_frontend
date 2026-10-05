import type {
  ILeaveRequestResult,
  LeaveRequestType,
} from '@/features/student-permits/types/permit.types'

import { IconCheck, IconHistory } from '@tabler/icons-react'
import { QRCodeSVG } from 'qrcode.react'

import { ResponsiveDialog } from '@/components/composite/responsive-dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatDate } from '@/utils/datetime'

type LeaveRequestResultDialogProps = {
  type: LeaveRequestType
  result: ILeaveRequestResult | null
  onClose: () => void
  onViewHistory: () => void
}

const APPROVAL_COPY: Record<LeaveRequestType, string> = {
  sick_leave: 'Your request needs approval from your homeroom teacher.',
  early_out:
    'Your request needs approval from your subject teacher and the duty teacher.',
  late_arrival: 'Your request needs approval from the duty teacher.',
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 py-1.5 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-right font-medium break-all">{value}</span>
    </div>
  )
}

export function LeaveRequestResultDialog({
  type,
  result,
  onClose,
  onViewHistory,
}: LeaveRequestResultDialogProps) {
  const visible = result !== null

  return (
    <ResponsiveDialog
      title="Request Submitted"
      description="Your leave request is waiting for approval."
      isOpen={visible}
      onIsOpenChange={(next) => {
        if (!next) onClose()
      }}
    >
      {result && (
        <div className="space-y-4">
          <div className="flex items-center gap-3 rounded-lg border border-green-200 bg-green-50 p-3 dark:border-green-900 dark:bg-green-950/40">
            <span className="flex size-9 items-center justify-center rounded-full bg-green-600 text-white">
              <IconCheck className="size-5" />
            </span>
            <div>
              <p className="text-sm font-semibold">Pending approval</p>
              <p className="text-xs text-muted-foreground">
                {APPROVAL_COPY[type]}
              </p>
            </div>
          </div>

          <div className="flex flex-col items-center gap-2 rounded-lg border p-4">
            <QRCodeSVG value={result.key} size={160} className="rounded" />
            <p className="font-mono text-sm font-semibold tracking-wider">
              {result.key}
            </p>
            <Badge variant="secondary">{result.status.label}</Badge>
          </div>

          <dl className="divide-y rounded-lg border px-3">
            <DetailRow label="Type" value={result.type.label} />
            {result.range_date.length > 0 && (
              <DetailRow
                label="Dates"
                value={result.range_date.filter(Boolean).join(', ') || '-'}
              />
            )}
            {result.date && <DetailRow label="Date" value={result.date} />}
            {result.time_out && (
              <DetailRow
                label="Leave Time"
                value={`${result.time_out} – ${result.time_in ?? ''}`}
              />
            )}
            {result.estimated_arrival_time && (
              <DetailRow label="ETA" value={result.estimated_arrival_time} />
            )}
            {result.destination && (
              <DetailRow label="Destination" value={result.destination} />
            )}
            {result.requested_at && (
              <DetailRow
                label="Requested At"
                value={formatDate(result.requested_at, 'DD MMM YYYY HH:mm')}
              />
            )}
          </dl>

          <p className="text-xs text-muted-foreground">
            You can check the leave request history page periodically for status
            updates.
          </p>

          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button type="button" variant="outline" onClick={onClose}>
              Close
            </Button>
            <Button type="button" onClick={onViewHistory}>
              <IconHistory className="size-4" />
              View History
            </Button>
          </div>
        </div>
      )}
    </ResponsiveDialog>
  )
}
