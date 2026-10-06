import type { IDutyLeaveDetail } from '@/features/duty-teacher/types/duty-teacher.types'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { toast } from 'sonner'

import { ButtonLoading } from '@/components/composite/button-loading'
import { ResponsiveDialog } from '@/components/composite/responsive-dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Textarea } from '@/components/ui/textarea'
import { Typography } from '@/components/ui/typography'
import { dutyKeys } from '@/features/duty-teacher/lib/duty-teacher-query-options'
import {
  decideDutyLeaveRequest,
  getDutyLeaveRequestDetail,
} from '@/features/duty-teacher/services/duty-teacher-api'
import { getErrorMessage } from '@/utils/error'

interface DutyDetailDialogProps {
  leaveRequestId: number | null
  canDecide: boolean
  open: boolean
  onOpenChange: (open: boolean) => void
}

function Field({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div>
      <Typography as="span" variant="muted" className="block text-xs">
        {label}
      </Typography>
      <div className="mt-1 text-sm">{children}</div>
    </div>
  )
}

function DetailBody({
  id,
  canDecide,
  onDecided,
}: {
  id: number
  canDecide: boolean
  onDecided: () => void
}) {
  const queryClient = useQueryClient()
  const [notes, setNotes] = useState('')
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: dutyKeys.detail(id),
    queryFn: () => getDutyLeaveRequestDetail(id),
  })

  const decide = useMutation({
    mutationFn: (decision: 'approved' | 'rejected') => {
      const kind = data?.type.key.toLowerCase().includes('early')
        ? 'early-out'
        : 'late-arrival'
      // ponytail: kind inferred from type label key; upgrade when backend returns explicit kind.
      return decideDutyLeaveRequest(id, kind as 'early-out' | 'late-arrival', {
        decision,
        notes: notes.trim() ? notes.trim() : undefined,
      })
    },
    onSuccess: (_d, decision) => {
      toast.success(
        decision === 'approved' ? 'Request approved.' : 'Request rejected.',
      )
      queryClient.invalidateQueries({ queryKey: dutyKeys.lists() })
      queryClient.invalidateQueries({ queryKey: dutyKeys.detail(id) })
      setNotes('')
      onDecided()
    },
    onError: (e) => toast.error(getErrorMessage(e)),
  })

  if (isLoading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-16 w-full" />
        <div className="grid grid-cols-2 gap-3">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
        <Skeleton className="h-24 w-full" />
      </div>
    )
  }

  if (isError || !data) {
    return (
      <div className="space-y-3 text-center">
        <Typography as="p" variant="muted" className="text-sm">
          Failed to load request detail.
        </Typography>
        <Button variant="outline" size="sm" onClick={() => refetch()}>
          Try again
        </Button>
      </div>
    )
  }

  const d: IDutyLeaveDetail = data
  const pending = d.status.key.toLowerCase() === 'pending'

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="outline">{d.type.label}</Badge>
        <Badge variant="secondary" className="capitalize">
          {d.status.label}
        </Badge>
        <Badge variant="secondary" className="capitalize">
          {d.current_step?.replaceAll('_', ' ') || 'N/A'}
        </Badge>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Field label="Date">{d.date}</Field>
        <Field label="Requested at">{d.requested_at}</Field>
        {d.time_out && <Field label="Time out">{d.time_out}</Field>}
        {d.time_in && <Field label="Time in">{d.time_in}</Field>}
        {d.destination && <Field label="Destination">{d.destination}</Field>}
        {d.contact_person && (
          <Field label="Contact person">{d.contact_person}</Field>
        )}
        {d.estimated_arrival_time && (
          <Field label="Estimated arrival">{d.estimated_arrival_time}</Field>
        )}
      </div>

      {d.exit_reason && (
        <Field label="Exit reason">
          <p className="rounded-md border bg-background p-3">{d.exit_reason}</p>
        </Field>
      )}
      {d.late_reason && (
        <Field label="Late reason">
          <p className="rounded-md border bg-background p-3">{d.late_reason}</p>
        </Field>
      )}
      {d.notes && (
        <Field label="Notes">
          <p className="rounded-md border bg-background p-3">{d.notes}</p>
        </Field>
      )}

      {d.approvals.length > 0 && (
        <Field label="Approval trail">
          <ul className="space-y-2">
            {d.approvals.map((a, i) => (
              <li
                key={`${a.step}-${i}`}
                className="flex flex-wrap items-center gap-x-2 gap-y-1 rounded-md border p-2 text-xs"
              >
                <span className="font-medium capitalize">
                  {a.step.replaceAll('_', ' ')}
                </span>
                <Badge variant="outline" className="capitalize">
                  {a.decision}
                </Badge>
                {a.decided_at && (
                  <span className="text-muted-foreground">{a.decided_at}</span>
                )}
                {a.notes && (
                  <span className="w-full text-muted-foreground">
                    {a.notes}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </Field>
      )}

      {canDecide && pending && (
        <div className="space-y-3 border-t pt-4">
          <Textarea
            placeholder="Decision notes (optional, max 255 chars)"
            maxLength={255}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <ButtonLoading
              variant="destructive"
              loading={decide.isPending}
              onClick={() => decide.mutate('rejected')}
            >
              Reject
            </ButtonLoading>
            <ButtonLoading
              loading={decide.isPending}
              onClick={() => decide.mutate('approved')}
            >
              Approve
            </ButtonLoading>
          </div>
        </div>
      )}
      {canDecide && !pending && (
        <Typography as="p" variant="muted" className="text-xs">
          This request has already been decided.
        </Typography>
      )}
      {!canDecide && (
        <Typography as="p" variant="muted" className="text-xs">
          You are not on duty, so decisions are disabled.
        </Typography>
      )}
    </div>
  )
}

export function DutyDetailDialog({
  leaveRequestId,
  canDecide,
  open,
  onOpenChange,
}: DutyDetailDialogProps) {
  return (
    <ResponsiveDialog
      title="Leave request detail"
      description="Early-out or late-arrival request for today."
      isOpen={open}
      onIsOpenChange={onOpenChange}
    >
      <div className="px-4 pb-4 md:px-0 md:pb-0">
        {leaveRequestId !== null && (
          <DetailBody
            id={leaveRequestId}
            canDecide={canDecide}
            onDecided={() => onOpenChange(false)}
          />
        )}
      </div>
    </ResponsiveDialog>
  )
}
