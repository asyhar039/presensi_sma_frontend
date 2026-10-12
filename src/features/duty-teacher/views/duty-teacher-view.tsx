import { IconQrcode } from '@tabler/icons-react'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'

import { DataTable } from '@/components/data-table'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { useDutyColumns } from '@/features/duty-teacher/components/duty-columns'
import { DutyDetailDialog } from '@/features/duty-teacher/components/duty-detail-dialog'
import { DutyScanDialog } from '@/features/duty-teacher/components/duty-scan-dialog'
import {
  DutyError,
  DutyHeading,
  DutySkeleton,
  NoDutyWarning,
  OutsideSlotWarning,
} from '@/features/duty-teacher/components/duty-states'
import { DutyToolbar } from '@/features/duty-teacher/components/duty-toolbar'
import {
  dutyKeys,
  dutyStatusQueryOptions,
} from '@/features/duty-teacher/lib/duty-teacher-query-options'
import {
  DUTY_DEFAULT_FILTERS,
  DUTY_DEFAULT_ORDER,
  DUTY_DEFAULT_SORT_BY,
  DUTY_PER_PAGE_OPTIONS,
  DUTY_SORT_BY,
  dutyFilterSchema,
} from '@/features/duty-teacher/lib/duty-teacher-table'
import { getDutyLeaveRequests } from '@/features/duty-teacher/services/duty-teacher-api'
import { getErrorMessage } from '@/utils/error'

function DutyTeacherContent() {
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [detailOpen, setDetailOpen] = useState(false)
  const [scanOpen, setScanOpen] = useState(false)

  const statusQuery = useQuery(dutyStatusQueryOptions())
  const columns = useDutyColumns({
    onViewDetail: (id) => {
      setSelectedId(id)
      setDetailOpen(true)
    },
  })

  if (statusQuery.isLoading) {
    return <DutySkeleton />
  }

  if (statusQuery.isError) {
    return (
      <DutyError
        message={getErrorMessage(
          statusQuery.error,
          'Failed to load duty status.',
        )}
        onRetry={() => statusQuery.refetch()}
      />
    )
  }

  const status = statusQuery.data
  if (!status?.has_duty_teacher) {
    return <NoDutyWarning />
  }

  // ponytail: is_active accepts boolean or legacy string flags; drop string branch when backend stabilizes on boolean.
  const rawActive = status?.is_active
  const isActiveSlot =
    rawActive === true ||
    ['true', '1', 'active'].includes(String(rawActive ?? '').toLowerCase())

  if (!isActiveSlot) {
    return (
      <OutsideSlotWarning
        day={status?.duty_teacher?.day}
        startTime={status?.duty_teacher?.start_time}
        endTime={status?.duty_teacher?.end_time}
      />
    )
  }

  const slot = status.duty_teacher
  const badge = slot
    ? `${slot.day} • ${slot.start_time}–${slot.end_time}`
    : undefined

  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <DutyHeading
          title="Duty Teacher"
          description="Review today's early-out and late-arrival requests."
          badge={badge}
        />
        <Button onClick={() => setScanOpen(true)} className="w-full sm:w-auto">
          <IconQrcode />
          <span>Scan Request</span>
        </Button>
      </div>

      <Card>
        <CardHeader className="sr-only">
          <CardTitle>Duty leave requests</CardTitle>
          <CardDescription>
            Today&apos;s early-out and late-arrival requests
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            queryKey={dutyKeys.lists()}
            queryFn={getDutyLeaveRequests}
            allowedSortBy={DUTY_SORT_BY}
            defaultSortBy={DUTY_DEFAULT_SORT_BY}
            defaultOrder={DUTY_DEFAULT_ORDER}
            perPageOptions={DUTY_PER_PAGE_OPTIONS}
            defaultFilters={DUTY_DEFAULT_FILTERS}
            filterSchema={dutyFilterSchema}
            toolbar={<DutyToolbar />}
            searchPlaceholder="Search student name or ID number..."
            emptyTitle="No leave requests"
            emptyDescription="No early-out or late-arrival requests for today."
            errorMessage="Failed to load leave requests."
            syncWithQueryParams
          />
        </CardContent>
      </Card>

      <DutyScanDialog open={scanOpen} onOpenChange={setScanOpen} />

      <DutyDetailDialog
        leaveRequestId={selectedId}
        canDecide
        open={detailOpen}
        onOpenChange={setDetailOpen}
      />
    </div>
  )
}

export function DutyTeacherView() {
  return <DutyTeacherContent />
}
