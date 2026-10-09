import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { toast } from 'sonner'

import { DataTable } from '@/components/data-table'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { SessionAnalytics } from '@/features/teacher-session/components/session-analytics'
import { SessionFeed } from '@/features/teacher-session/components/session-feed'
import { SessionQrCard } from '@/features/teacher-session/components/session-qr-card'
import {
  NoScheduleWarning,
  OutsideSlotWarning,
  SessionError,
  SessionHeading,
  SessionSkeleton,
} from '@/features/teacher-session/components/session-states'
import { useSubjectColumns } from '@/features/teacher-session/components/subject-columns'
import { SubjectDetailDialog } from '@/features/teacher-session/components/subject-detail-dialog'
import { SubjectToolbar } from '@/features/teacher-session/components/subject-toolbar'
import { usePresenceRealtime } from '@/features/teacher-session/hooks/use-presence-realtime'
import {
  presenceCurrentQueryOptions,
  teacherSessionKeys,
} from '@/features/teacher-session/lib/teacher-session-query-options'
import {
  SUBJECT_DEFAULT_FILTERS,
  SUBJECT_DEFAULT_ORDER,
  SUBJECT_DEFAULT_SORT_BY,
  SUBJECT_PER_PAGE_OPTIONS,
  SUBJECT_SORT_BY,
  subjectFilterSchema,
} from '@/features/teacher-session/lib/teacher-session-table'
import {
  getSubjectLeaveRequests,
  refreshPresenceQR,
  startPresenceSession,
  stopPresenceSession,
} from '@/features/teacher-session/services/teacher-session-api'
import { getErrorMessage } from '@/utils/error'

export function TeacherDashboardView() {
  const queryClient = useQueryClient()
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [detailOpen, setDetailOpen] = useState(false)
  const sessionQuery = useQuery(presenceCurrentQueryOptions())
  const columns = useSubjectColumns({
    onViewDetail: (id) => {
      setSelectedId(id)
      setDetailOpen(true)
    },
  })

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: teacherSessionKeys.current() })
  const start = useMutation({
    mutationFn: startPresenceSession,
    onSuccess: () => {
      toast.success('Presence session started.')
      invalidate()
    },
    onError: (e) => toast.error(getErrorMessage(e)),
  })
  const stop = useMutation({
    mutationFn: stopPresenceSession,
    onSuccess: () => {
      toast.success('Presence session stopped.')
      invalidate()
    },
    onError: (e) => toast.error(getErrorMessage(e)),
  })
  const refresh = useMutation({
    mutationFn: refreshPresenceQR,
    onSuccess: () => {
      toast.success('QR code refreshed.')
      invalidate()
    },
    onError: (e) => toast.error(getErrorMessage(e)),
  })

  const session = sessionQuery.data
  usePresenceRealtime(session?.channel ?? null, session?.session_id ?? null)

  if (sessionQuery.isPending) return <SessionSkeleton />
  if (sessionQuery.isError || !session) {
    return (
      <SessionError
        message={getErrorMessage(
          sessionQuery.error,
          'Failed to load presence state.',
        )}
        onRetry={() => sessionQuery.refetch()}
      />
    )
  }
  if (!session.schedule) return <NoScheduleWarning />
  if (!session.is_within_time) {
    return (
      <div className="flex w-full flex-col gap-6">
        <SessionHeading
          badge={`${session.schedule.day} • ${session.schedule.start_time}–${session.schedule.end_time}`}
        />
        <OutsideSlotWarning
          startTime={session.schedule.start_time}
          endTime={session.schedule.end_time}
        />
      </div>
    )
  }

  return (
    <div className="flex w-full flex-col gap-6">
      <SessionHeading
        badge={`${session.schedule.day} • ${session.schedule.start_time}–${session.schedule.end_time}`}
      />
      <div className="grid items-start gap-6 lg:grid-cols-12">
        <div className="space-y-6 lg:col-span-5">
          <SessionQrCard
            session={session}
            onStart={() => start.mutate()}
            onStop={() => stop.mutate()}
            onRefresh={() => refresh.mutate()}
            starting={start.isPending}
            stopping={stop.isPending}
            refreshing={refresh.isPending}
          />
          <SessionFeed
            feed={session.feed}
            isFetching={sessionQuery.isFetching}
          />
        </div>
        <div className="space-y-6 lg:col-span-7">
          {session?.analytics && (
            <SessionAnalytics analytics={session?.analytics} />
          )}
          <Card>
            <CardHeader>
              <CardTitle>Early-out requests</CardTitle>
              <CardDescription>
                Today&apos;s requests in classes you teach. Approve first, then
                the duty teacher decides.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DataTable
                columns={columns}
                queryKey={teacherSessionKeys.lists()}
                queryFn={getSubjectLeaveRequests}
                allowedSortBy={SUBJECT_SORT_BY}
                defaultSortBy={SUBJECT_DEFAULT_SORT_BY}
                defaultOrder={SUBJECT_DEFAULT_ORDER}
                perPageOptions={SUBJECT_PER_PAGE_OPTIONS}
                defaultFilters={SUBJECT_DEFAULT_FILTERS}
                filterSchema={subjectFilterSchema}
                toolbar={<SubjectToolbar />}
                searchPlaceholder="Search student name or ID number..."
                emptyTitle="No leave requests"
                emptyDescription="No early-out requests for your classes today."
                errorMessage="Failed to load leave requests."
                syncWithQueryParams
              />
            </CardContent>
          </Card>
        </div>
      </div>
      <SubjectDetailDialog
        leaveRequestId={selectedId}
        open={detailOpen}
        onOpenChange={setDetailOpen}
      />
    </div>
  )
}
