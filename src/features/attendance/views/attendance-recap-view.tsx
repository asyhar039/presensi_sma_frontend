import type {
  AttendanceStatus,
  IAttendanceParams,
  IAttendanceSummary,
  IStudentAttendanceSummary,
} from '@/features/attendance/types/attendance.types'

import { useSearch } from '@tanstack/react-router'
import { useEffect, useState } from 'react'

import { DataTable } from '@/components/data-table'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AttendanceProvider } from '@/features/attendance/components/attendance-store'
import { AttendanceSummaryCards } from '@/features/attendance/components/attendance-summary-cards'
import { useAttendanceSummaryColumns } from '@/features/attendance/components/attendance-summary-columns'
import { AttendanceToolbar } from '@/features/attendance/components/attendance-toolbar'
import { attendanceKeys } from '@/features/attendance/lib/attendance-query-options'
import {
  ATTENDANCE_DEFAULT_FILTERS,
  ATTENDANCE_DEFAULT_ORDER,
  ATTENDANCE_PER_PAGE_OPTIONS,
  ATTENDANCE_SUMMARY_DEFAULT_SORT_BY,
  ATTENDANCE_SUMMARY_SORT_BY,
  attendanceFilterSchema,
} from '@/features/attendance/lib/attendance-table'
import {
  getAttendanceSummary,
  getStudentAttendanceSummaries,
} from '@/features/attendance/services/attendance-api'

function getSearchParam(param: string): string {
  if (typeof window === 'undefined') return ''
  const params = new URLSearchParams(window.location.search)
  return params.get(param) || ''
}

function AttendanceRecapContent() {
  const search = useSearch({ strict: false })
  const summaryColumns = useAttendanceSummaryColumns()
  const [studentSummaries, setStudentSummaries] = useState<
    IStudentAttendanceSummary[] | null
  >(null)
  const [isSummariesLoading, setIsSummariesLoading] = useState(true)
  const [attendanceSummary, setAttendanceSummary] =
    useState<IAttendanceSummary | null>(null)

  useEffect(() => {
    const fetchSummaries = async () => {
      setIsSummariesLoading(true)
      try {
        const classroomId =
          (search.classroom_id as string) || getSearchParam('classroom_id')
        const month = (search.month as string) || getSearchParam('month')
        const semester =
          (search.semester as string) || getSearchParam('semester')
        const searchValue = search.search as string | undefined

        const params: IAttendanceParams = {}
        if (classroomId) params.classroom_id = classroomId
        if (month) params.month = month
        if (semester) params.semester = semester
        if (searchValue) params.search = searchValue

        const data = await getStudentAttendanceSummaries(params)
        setStudentSummaries(data.items)
      } catch (error) {
        console.error('Failed to fetch student summaries:', error)
      } finally {
        setIsSummariesLoading(false)
      }
    }

    fetchSummaries()
  }, [search])

  useEffect(() => {
    const fetchAttendanceSummary = async () => {
      try {
        const classroomId =
          (search.classroom_id as string) || getSearchParam('classroom_id')
        const month = (search.month as string) || getSearchParam('month')
        const semester =
          (search.semester as string) || getSearchParam('semester')

        const params: Pick<
          IAttendanceParams,
          'classroom_id' | 'month' | 'semester'
        > = {}
        if (classroomId) params.classroom_id = classroomId
        if (month) params.month = month
        if (semester) params.semester = semester

        const summaryData = await getAttendanceSummary(params)
        setAttendanceSummary(summaryData)
      } catch (error) {
        console.error('Failed to fetch attendance summary:', error)
      }
    }

    fetchAttendanceSummary()
  }, [search])

  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold tracking-tight">
            Rekap Presensi Kelas
          </h1>
          <p className="text-sm text-muted-foreground">
            Pantau dan analisis kehadiran siswa per kelas, bulan, dan semester.
          </p>
        </div>
      </div>

      {isSummariesLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="pt-6 h-24" />
            </Card>
          ))}
        </div>
      ) : studentSummaries ? (
        <>
          {attendanceSummary && (
            <AttendanceSummaryCards summary={attendanceSummary} />
          )}
          <Card>
            <CardHeader className="sr-only">
              <CardTitle>Rekap Presensi Siswa</CardTitle>
            </CardHeader>
            <CardContent>
              <DataTable
                columns={summaryColumns}
                queryKey={attendanceKeys.lists()}
                queryFn={async (params) => {
                  const apiParams: IAttendanceParams = {}
                  if (params.classroom_id)
                    apiParams.classroom_id = Number(params.classroom_id)
                  if (params.month) apiParams.month = Number(params.month)
                  if (params.semester)
                    apiParams.semester = String(params.semester)
                  if (params.status && params.status !== 'all')
                    apiParams.status = params.status as AttendanceStatus
                  if (params.search) apiParams.search = String(params.search)
                  if (params.page) apiParams.page = Number(params.page)
                  if (params.per_page)
                    apiParams.per_page = Number(params.per_page)
                  if (params.sortBy) apiParams.sortBy = String(params.sortBy)
                  if (params.order) apiParams.order = String(params.order)

                  return getStudentAttendanceSummaries(apiParams)
                }}
                allowedSortBy={ATTENDANCE_SUMMARY_SORT_BY}
                defaultSortBy={ATTENDANCE_SUMMARY_DEFAULT_SORT_BY}
                defaultOrder={ATTENDANCE_DEFAULT_ORDER}
                perPageOptions={ATTENDANCE_PER_PAGE_OPTIONS}
                defaultFilters={ATTENDANCE_DEFAULT_FILTERS}
                filterSchema={attendanceFilterSchema}
                toolbar={<AttendanceToolbar />}
                searchPlaceholder="Cari NIS atau nama siswa..."
                syncWithQueryParams
                emptyTitle="Tidak ada data presensi"
                emptyDescription="Coba ubah filter atau pilih kelas lain."
              />
            </CardContent>
          </Card>
        </>
      ) : null}
    </div>
  )
}

export function AttendanceRecapView() {
  return (
    <AttendanceProvider>
      <AttendanceRecapContent />
    </AttendanceProvider>
  )
}
