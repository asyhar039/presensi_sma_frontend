import type { ISubjectLeaveDetail } from '@/features/teacher-session/types/teacher-session.types'

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
import { teacherSessionKeys } from '@/features/teacher-session/lib/teacher-session-query-options'
import {
  decideSubjectLeave,
  getSubjectLeaveDetail,
} from '@/features/teacher-session/services/teacher-session-api'
import { getErrorMessage } from '@/utils/error'

type SubjectDetailDialogProps = {
  leaveRequestId: number | null
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

function DetailBody({ id, onDecided }: { id: number; onDecided: () => void }) {
  const queryClient = useQueryClient()
  const [notes, setNotes] = useState('')
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: teacherSessionKeys.detail(id),
    queryFn: () => getSubjectLeaveDetail(id),
  })
  const decide = useMutation({
    mutationFn: (decision: 'approved' | 'rejected') =>
      decideSubjectLeave(id, decision, notes.trim() || undefined),
    onSuccess: (_d, decision) => {
      toast.success(
        decision === 'approved' ? 'Request approved.' : 'Request rejected.',
      )
      queryClient.invalidateQueries({ queryKey: teacherSessionKeys.lists() })
      queryClient.invalidateQueries({ queryKey: teacherSessionKeys.detail(id) })
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
  const d: ISubjectLeaveDetail = data
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
      {pending ? (
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
      ) : (
        <Typography as="p" variant="muted" className="text-xs">
          This request has already been decided.
        </Typography>
      )}
    </div>
  )
}

export function SubjectDetailDialog({
  leaveRequestId,
  open,
  onOpenChange,
}: SubjectDetailDialogProps) {
  return (
    <ResponsiveDialog
      title="Early-out request"
      description="First approval as the scheduled subject teacher."
      isOpen={open}
      onIsOpenChange={onOpenChange}
    >
      <div className="px-4 pb-4 md:px-0 md:pb-0">
        {leaveRequestId !== null && (
          <DetailBody
            id={leaveRequestId}
            onDecided={() => onOpenChange(false)}
          />
        )}
      </div>
    </ResponsiveDialog>
  )
}
