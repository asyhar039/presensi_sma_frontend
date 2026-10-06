import { IconExternalLink, IconFileText } from '@tabler/icons-react'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'

import { ButtonLoading } from '@/components/composite/button-loading'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Field, FieldLabel } from '@/components/ui/field'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Skeleton } from '@/components/ui/skeleton'
import { Textarea } from '@/components/ui/textarea'
import { Typography } from '@/components/ui/typography'
import { DATE_FORMAT } from '@/constants/app'
import {
  HomeroomStatusBadge,
  HomeroomTypeBadge,
} from '@/features/homeroom/components/homeroom-badges'
import { useHomeroomDecision } from '@/features/homeroom/hooks/use-homeroom-decision'
import { homeroomLeaveDetailQueryOptions } from '@/features/homeroom/lib/homeroom-query-options'
import { formatDate } from '@/utils/datetime'
import { getErrorMessage } from '@/utils/error'

type DetailFieldProps = {
  label: string
  children: React.ReactNode
}

function DetailField({ label, children }: DetailFieldProps) {
  return (
    <div className="flex flex-col gap-1">
      <Typography as="span" variant="muted" className="text-xs">
        {label}
      </Typography>
      <div className="text-sm">{children}</div>
    </div>
  )
}

type HomeroomDetailDialogProps = {
  leaveId: number | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function HomeroomDetailDialog({
  leaveId,
  open,
  onOpenChange,
}: HomeroomDetailDialogProps) {
  const [notes, setNotes] = useState('')
  const decision = useHomeroomDecision()
  const detailQuery = useQuery({
    ...homeroomLeaveDetailQueryOptions(leaveId),
    enabled: open && leaveId !== null,
  })
  const detail = detailQuery.data
  const isPending = detail?.status.key === 'pending'
  const canDecideSick = isPending && detail?.type.key === 'sick_leave'
  const isDeciding = decision.isPending

  const handleDecide = (choice: 'approved' | 'rejected') => {
    if (!leaveId) return
    decision.mutate(
      { id: leaveId, decision: choice, notes: notes.trim() || undefined },
      {
        onSuccess: () => {
          setNotes('')
          onOpenChange(false)
        },
      },
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between gap-2 pr-6">
            <span>Leave Request Detail</span>
            {detail && (
              <HomeroomStatusBadge
                value={detail.status.key}
                label={detail.status.label}
              />
            )}
          </DialogTitle>
          <DialogDescription>
            Full detail of the student leave request and its approval trail.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[70vh] pr-3">
          {detailQuery.isLoading ? (
            <div className="flex flex-col gap-3 py-2">
              <Skeleton className="h-16 w-full" />
              <div className="grid grid-cols-2 gap-3">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
              <Skeleton className="h-24 w-full" />
            </div>
          ) : detailQuery.isError || !detail ? (
            <div className="flex flex-col items-center gap-3 py-8 text-center">
              <Typography as="p" variant="muted" className="text-sm">
                {getErrorMessage(
                  detailQuery.error,
                  'Failed to load leave request detail.',
                )}
              </Typography>
              <Button
                variant="outline"
                size="sm"
                onClick={() => detailQuery.refetch()}
              >
                Try again
              </Button>
            </div>
          ) : (
            <div className="flex flex-col gap-4 py-2">
              <div className="flex flex-wrap items-center gap-2">
                <HomeroomTypeBadge
                  value={detail.type.key}
                  label={detail.type.label}
                />
                {detail.current_step && (
                  <Badge variant="secondary" className="capitalize">
                    {detail.current_step?.replaceAll('_', ' ')}
                  </Badge>
                )}
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <DetailField label="Date">
                  <span className="font-medium">
                    {formatDate(detail.date, DATE_FORMAT.DATE)}
                  </span>
                </DetailField>
                <DetailField label="Requested At">
                  {formatDate(detail.requested_at, DATE_FORMAT.DATE_TIME)}
                </DetailField>
                {detail.start_date && (
                  <DetailField label="Start Date">
                    {formatDate(detail.start_date, DATE_FORMAT.DATE)}
                  </DetailField>
                )}
                {detail.end_date && (
                  <DetailField label="End Date">
                    {formatDate(detail.end_date, DATE_FORMAT.DATE)}
                  </DetailField>
                )}
                {detail.time_out && (
                  <DetailField label="Time Out">{detail.time_out}</DetailField>
                )}
                {detail.time_in && (
                  <DetailField label="Time In">{detail.time_in}</DetailField>
                )}
                {detail.destination && (
                  <DetailField label="Destination">
                    {detail.destination}
                  </DetailField>
                )}
                {detail.contact_person && (
                  <DetailField label="Contact Person">
                    {detail.contact_person}
                  </DetailField>
                )}
                {detail.estimated_arrival_time && (
                  <DetailField label="Estimated Arrival">
                    {detail.estimated_arrival_time}
                  </DetailField>
                )}
              </div>
              {detail.exit_reason && (
                <DetailField label="Exit Reason">
                  <span className="whitespace-pre-wrap">
                    {detail.exit_reason}
                  </span>
                </DetailField>
              )}
              {detail.late_reason && (
                <DetailField label="Late Reason">
                  <span className="whitespace-pre-wrap">
                    {detail.late_reason}
                  </span>
                </DetailField>
              )}
              {detail.notes && (
                <DetailField label="Notes">
                  <span className="whitespace-pre-wrap">{detail.notes}</span>
                </DetailField>
              )}
              {detail.attachment && (
                <DetailField label="Attachment">
                  <a href={detail.attachment} target="_blank" rel="noreferrer">
                    <Button variant="outline" size="sm" className="gap-2">
                      <IconFileText className="size-4" />
                      <span>Open attachment</span>
                      <IconExternalLink className="size-3 text-muted-foreground" />
                    </Button>
                  </a>
                </DetailField>
              )}
              {detail.approvals.length > 0 && (
                <DetailField label="Approval Trail">
                  <ol className="flex flex-col gap-2">
                    {detail.approvals.map((approval, index) => (
                      <li
                        key={`${approval.step}-${index}`}
                        className="rounded-md border p-2.5 text-xs"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-semibold capitalize">
                            {approval.step.replaceAll('_', ' ')}
                          </span>
                          <Badge variant="outline" className="capitalize">
                            {approval.decision}
                          </Badge>
                        </div>
                        {approval.decided_at && (
                          <p className="mt-1 text-muted-foreground">
                            {formatDate(
                              approval.decided_at,
                              DATE_FORMAT.DATE_TIME,
                            )}
                          </p>
                        )}
                        {approval.notes && (
                          <p className="mt-1">{approval.notes}</p>
                        )}
                      </li>
                    ))}
                  </ol>
                </DetailField>
              )}
              {canDecideSick ? (
                <Field>
                  <FieldLabel htmlFor="homeroom-decision-notes">
                    Decision note (optional for reject)
                  </FieldLabel>
                  <Textarea
                    id="homeroom-decision-notes"
                    placeholder="Add an optional note (max 255 characters)"
                    maxLength={255}
                    value={notes}
                    onChange={(event) => setNotes(event.target.value)}
                    rows={3}
                  />
                  <div className="mt-3 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                    <ButtonLoading
                      variant="outline"
                      loading={isDeciding}
                      onClick={() => handleDecide('rejected')}
                    >
                      Reject
                    </ButtonLoading>
                    <ButtonLoading
                      loading={isDeciding}
                      onClick={() => handleDecide('approved')}
                    >
                      Approve
                    </ButtonLoading>
                  </div>
                </Field>
              ) : isPending ? (
                <Typography
                  as="p"
                  variant="muted"
                  className="rounded-md bg-muted/60 p-3 text-xs"
                >
                  Only sick leave requests can be decided by the homeroom
                  teacher.
                </Typography>
              ) : null}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
