import type { IHomeroomLeaveItem } from '@/features/homeroom/types/homeroom.types'

import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'

import { DataTable } from '@/components/data-table'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useHomeroomColumns } from '@/features/homeroom/components/homeroom-columns'
import { HomeroomDetailDialog } from '@/features/homeroom/components/homeroom-detail-dialog'
import {
  HomeroomError,
  HomeroomTableSkeleton,
  NotHomeroomWarning,
} from '@/features/homeroom/components/homeroom-feedback'
import { HomeroomToolbar } from '@/features/homeroom/components/homeroom-toolbar'
import {
  homeroomInfoQueryOptions,
  homeroomKeys,
} from '@/features/homeroom/lib/homeroom-query-options'
import {
  HOMEROOM_DEFAULT_FILTERS,
  HOMEROOM_DEFAULT_ORDER,
  HOMEROOM_DEFAULT_SORT_BY,
  HOMEROOM_PER_PAGE_OPTIONS,
  HOMEROOM_SORT_BY,
  homeroomFilterSchema,
} from '@/features/homeroom/lib/homeroom-table'
import { getHomeroomLeaveRequests } from '@/features/homeroom/services/homeroom-api'
import { getErrorMessage } from '@/utils/error'

type HomeroomTableProps = {
  onViewDetail: (item: IHomeroomLeaveItem) => void
}

function HomeroomTable({ onViewDetail }: HomeroomTableProps) {
  const columns = useHomeroomColumns({ onViewDetail })

  return (
    <DataTable
      columns={columns}
      queryKey={homeroomKeys.lists()}
      queryFn={getHomeroomLeaveRequests}
      allowedSortBy={HOMEROOM_SORT_BY}
      defaultSortBy={HOMEROOM_DEFAULT_SORT_BY}
      defaultOrder={HOMEROOM_DEFAULT_ORDER}
      perPageOptions={HOMEROOM_PER_PAGE_OPTIONS}
      defaultFilters={HOMEROOM_DEFAULT_FILTERS}
      filterSchema={homeroomFilterSchema}
      toolbar={<HomeroomToolbar />}
      searchPlaceholder="Search by student name or ID number..."
      emptyTitle="No leave requests found"
      emptyDescription="There are no leave requests from your homeroom class yet."
      errorMessage="Failed to load leave requests. Please try again."
      syncWithQueryParams
    />
  )
}

function HomeroomPermitContent() {
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [detailOpen, setDetailOpen] = useState(false)
  const homeroomQuery = useQuery(homeroomInfoQueryOptions())
  const homeroom = homeroomQuery.data

  const handleViewDetail = (item: IHomeroomLeaveItem) => {
    setSelectedId(item.leave_request.id)
    setDetailOpen(true)
  }

  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex flex-col gap-1">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-2xl font-bold tracking-tight">
            Homeroom Leave Requests
          </h1>
          {homeroomQuery.isLoading ? (
            <Skeleton className="h-5 w-24" />
          ) : (
            homeroom?.class && (
              <Badge variant="secondary">{homeroom.class.name}</Badge>
            )
          )}
        </div>
        <p className="text-sm text-muted-foreground">
          Review sick leave, early out, and late arrival requests from your
          homeroom class.
        </p>
      </div>

      {homeroomQuery.isLoading ? (
        <Card>
          <CardContent className="pt-6">
            <HomeroomTableSkeleton />
          </CardContent>
        </Card>
      ) : homeroomQuery.isError ? (
        <HomeroomError
          message={getErrorMessage(
            homeroomQuery.error,
            'Failed to load homeroom data.',
          )}
          onRetry={() => homeroomQuery.refetch()}
        />
      ) : !homeroom?.has_homeroom ? (
        <NotHomeroomWarning />
      ) : (
        <Card>
          <CardHeader className="sr-only">
            <CardTitle>Homeroom leave requests</CardTitle>
            <CardDescription>
              Leave requests from your homeroom class
            </CardDescription>
          </CardHeader>
          <CardContent>
            <HomeroomTable onViewDetail={handleViewDetail} />
          </CardContent>
        </Card>
      )}

      <HomeroomDetailDialog
        leaveId={selectedId}
        open={detailOpen}
        onOpenChange={setDetailOpen}
      />
    </div>
  )
}

export function HomeroomPermitView() {
  return <HomeroomPermitContent />
}
