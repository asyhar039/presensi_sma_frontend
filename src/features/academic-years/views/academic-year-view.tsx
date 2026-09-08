import { IconPlus } from '@tabler/icons-react'

import { DataTable } from '@/components/data-table'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { useAcademicYearColumns } from '@/features/academic-years/components/academic-year-columns'
import { AcademicYearDialog } from '@/features/academic-years/components/academic-year-dialog'
import {
  AcademicYearProvider,
  useAcademicYearStore,
} from '@/features/academic-years/components/academic-year-store'
import { AcademicYearToolbar } from '@/features/academic-years/components/academic-year-toolbar'
import { academicYearKeys } from '@/features/academic-years/lib/academic-year-query-options'
import {
  ACADEMIC_YEAR_DEFAULT_ORDER,
  ACADEMIC_YEAR_DEFAULT_SORT_BY,
  ACADEMIC_YEAR_FILTER_DEFS,
  ACADEMIC_YEAR_PER_PAGE_OPTIONS,
  ACADEMIC_YEAR_SORT_BY,
} from '@/features/academic-years/lib/academic-year-table'
import { getAcademicYears } from '@/features/academic-years/services/academic-year-api'

function AcademicYearContent() {
  const openCreate = useAcademicYearStore((state) => state.openCreate)
  const columns = useAcademicYearColumns()

  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold tracking-tight">Academic Years</h1>
          <p className="text-sm text-muted-foreground">
            Manage academic year periods, semesters, and statuses.
          </p>
        </div>
        <Button onClick={openCreate} className="w-full sm:w-auto">
          <IconPlus />
          <span>New academic year</span>
        </Button>
      </div>

      <Card>
        <CardHeader className="sr-only">
          <CardTitle>Academic years</CardTitle>
          <CardDescription>List of academic years</CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            queryKey={academicYearKeys.lists()}
            queryFn={getAcademicYears}
            allowedSortBy={ACADEMIC_YEAR_SORT_BY}
            defaultSortBy={ACADEMIC_YEAR_DEFAULT_SORT_BY}
            defaultOrder={ACADEMIC_YEAR_DEFAULT_ORDER}
            perPageOptions={ACADEMIC_YEAR_PER_PAGE_OPTIONS}
            filterDefs={ACADEMIC_YEAR_FILTER_DEFS}
            toolbar={<AcademicYearToolbar />}
            syncWithQueryParams
          />
        </CardContent>
      </Card>

      <AcademicYearDialog />
    </div>
  )
}

export function AcademicYearView() {
  return (
    <AcademicYearProvider>
      <AcademicYearContent />
    </AcademicYearProvider>
  )
}
