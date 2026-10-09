import type { IPermitRecord } from '@/features/permits/types/permit.types'

import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'

import { DataTable } from '@/components/data-table'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { useAuth } from '@/context/auth-context'
import { usePermitColumns } from '@/features/permits/components/permit-columns'
import { PermitDetailDialog } from '@/features/permits/components/permit-detail-dialog'
import { PermitSummaryCards } from '@/features/permits/components/permit-summary-cards'
import { PermitToolbar } from '@/features/permits/components/permit-toolbar'
import {
  permitKeys,
  permitStatisticsQueryOptions,
} from '@/features/permits/lib/permit-query-options'
import {
  PERMIT_DEFAULT_FILTERS,
  PERMIT_DEFAULT_ORDER,
  PERMIT_DEFAULT_SORT_BY,
  PERMIT_PER_PAGE_OPTIONS,
  PERMIT_SORT_BY,
  permitFilterSchema,
} from '@/features/permits/lib/permit-table'
import { getPermits } from '@/features/permits/services/permit-api'

function TeacherPermitContent() {
  const { user } = useAuth()
  const [selectedPermit, setSelectedPermit] = useState<IPermitRecord | null>(
    null,
  )
  const [detailOpen, setDetailOpen] = useState(false)

  const { data: statsData } = useQuery(permitStatisticsQueryOptions())

  const columns = usePermitColumns({
    onViewDetail: (item) => {
      setSelectedPermit(item)
      setDetailOpen(true)
    },
  })

  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl font-bold tracking-tight">
              Daftar Izin Siswa
            </h1>
            <Badge variant="secondary" className="font-medium">
              Wali Kelas • {user?.name || 'Guru'}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Kelola dan pantau perizinan siswa untuk kelas bimbingan Anda.
          </p>
        </div>
      </div>

      {statsData && <PermitSummaryCards statistics={statsData} />}

      <Card>
        <CardContent>
          <DataTable
            columns={columns}
            queryKey={permitKeys.lists()}
            queryFn={getPermits}
            allowedSortBy={PERMIT_SORT_BY}
            defaultSortBy={PERMIT_DEFAULT_SORT_BY}
            defaultOrder={PERMIT_DEFAULT_ORDER}
            perPageOptions={PERMIT_PER_PAGE_OPTIONS}
            defaultFilters={PERMIT_DEFAULT_FILTERS}
            filterSchema={permitFilterSchema}
            toolbar={<PermitToolbar />}
            searchPlaceholder="Cari nama siswa atau NIS..."
            syncWithQueryParams
          />
        </CardContent>
      </Card>

      <PermitDetailDialog
        permit={selectedPermit}
        open={detailOpen}
        onOpenChange={setDetailOpen}
      />
    </div>
  )
}

export function TeacherPermitView() {
  return <TeacherPermitContent />
}
