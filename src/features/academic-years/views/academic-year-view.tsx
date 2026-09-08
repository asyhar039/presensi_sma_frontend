import type { SortingState } from '@tanstack/react-table'

import { IconPlus } from '@tabler/icons-react'
import { useMemo, useState } from 'react'

import { DataTable, DataTablePagination } from '@/components/data-table'
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
import { useAcademicYears } from '@/features/academic-years/hooks/use-academic-years'
import { academicYearKeys } from '@/features/academic-years/lib/academic-year-query-options'
import { getErrorMessage } from '@/utils/error'

const DEFAULT_PAGE = 1
const DEFAULT_PER_PAGE = 10

function AcademicYearContent() {
  const [page, setPage] = useState(DEFAULT_PAGE)
  const [perPage, setPerPage] = useState(DEFAULT_PER_PAGE)
  const [search, setSearch] = useState('')
  const [semester, setSemester] = useState('all')
  const [year, setYear] = useState('')
  const [sorting, setSorting] = useState<SortingState>([])

  const openCreate = useAcademicYearStore((state) => state.openCreate)
  const columns = useAcademicYearColumns()

  const params = useMemo(() => {
    const sort = sorting[0]
    return {
      page,
      per_page: perPage,
      search: search === '' ? undefined : search,
      semester: semester === 'all' ? undefined : semester,
      year: year === '' ? undefined : Number(year),
      sortBy: sort?.id,
      order: sort ? (sort.desc ? 'desc' : 'asc') : undefined,
    }
  }, [page, perPage, search, semester, year, sorting])

  const keys = useMemo(() => academicYearKeys.list(params), [params])
  const listQuery = useAcademicYears(params)

  const items = useMemo(() => listQuery.data?.items ?? [], [listQuery.data])
  const meta = listQuery.data?.meta

  const resetPage = () => setPage(DEFAULT_PAGE)

  const handleReset = () => {
    setSearch('')
    setSemester('all')
    setYear('')
    setSorting([])
    resetPage()
  }

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
            data={items}
            keys={keys}
            sorting={sorting}
            onSortingChange={(next) => {
              setSorting(next)
              resetPage()
            }}
            isLoading={listQuery.isLoading || listQuery.isFetching}
            isError={listQuery.isError}
            errorMessage={getErrorMessage(listQuery.error)}
            onRetry={() => listQuery.refetch()}
            toolbar={
              <AcademicYearToolbar
                search={search}
                onSearchChange={(value) => {
                  setSearch(value)
                  resetPage()
                }}
                semester={semester}
                onSemesterChange={(value) => {
                  setSemester(value)
                  resetPage()
                }}
                year={year}
                onYearChange={(value) => {
                  setYear(value)
                  resetPage()
                }}
                onReset={handleReset}
              />
            }
            footer={
              <DataTablePagination
                page={meta?.page ?? page}
                perPage={meta?.per_page ?? perPage}
                total={meta?.total ?? 0}
                totalPages={meta?.total_pages ?? 0}
                isLoading={listQuery.isFetching}
                onPageChange={setPage}
                onPerPageChange={(next) => {
                  setPerPage(next)
                  resetPage()
                }}
              />
            }
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
