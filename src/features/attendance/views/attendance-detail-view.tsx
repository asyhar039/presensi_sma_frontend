import type {
  IAttendanceParams,
  IStudentAttendanceDetail,
  IStudentAttendanceSummary,
} from '@/features/attendance/types/attendance.types'

import { IconArrowLeft, IconCalendar, IconUser } from '@tabler/icons-react'
import { useNavigate, useParams, useSearch } from '@tanstack/react-router'
import { useEffect, useState } from 'react'

import { DataTable } from '@/components/data-table'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Typography } from '@/components/ui/typography'
import { useAttendanceColumns } from '@/features/attendance/components/attendance-columns'
import { AttendanceProvider } from '@/features/attendance/components/attendance-store'
import { StudentAttendanceSummaryCards } from '@/features/attendance/components/attendance-summary-cards'
import { attendanceKeys } from '@/features/attendance/lib/attendance-query-options'
import {
  ATTENDANCE_DEFAULT_FILTERS,
  ATTENDANCE_DEFAULT_ORDER,
  ATTENDANCE_DEFAULT_SORT_BY,
  ATTENDANCE_PER_PAGE_OPTIONS,
  ATTENDANCE_SORT_BY,
  attendanceFilterSchema,
} from '@/features/attendance/lib/attendance-table'
import { getStudentAttendanceDetail } from '@/features/attendance/services/attendance-api'

function getSearchParam(param: string): string {
  if (typeof window === 'undefined') return ''
  const params = new URLSearchParams(window.location.search)
  return params.get(param) || ''
}

function StudentAttendanceDetailContent() {
  const navigate = useNavigate()
  const { studentId } = useParams({
    from: '/dashboard/attendance-recap/$studentId',
  })
  const search = useSearch({ strict: false })
  const [detail, setDetail] = useState<IStudentAttendanceDetail | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const columns = useAttendanceColumns()

  const studentIdNum = Number(studentId)

  useEffect(() => {
    if (!studentIdNum) return

    const fetchDetail = async () => {
      setIsLoading(true)
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

        const data = await getStudentAttendanceDetail(studentIdNum, params)
        setDetail(data)
      } catch (error) {
        console.error('Failed to fetch student attendance detail:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchDetail()
  }, [studentIdNum, search])

  const queryFn = async (params: IAttendanceParams) => {
    if (!studentIdNum)
      return {
        items: [],
        meta: { page: 1, per_page: 10, total: 0, total_pages: 0 },
      }

    const classroomId =
      (search.classroom_id as string) || getSearchParam('classroom_id')
    const month = (search.month as string) || getSearchParam('month')
    const semester = (search.semester as string) || getSearchParam('semester')

    const detailParams: Pick<
      IAttendanceParams,
      'classroom_id' | 'month' | 'semester'
    > = {}
    if (classroomId) detailParams.classroom_id = classroomId
    if (month) detailParams.month = month
    if (semester) detailParams.semester = semester

    const data = await getStudentAttendanceDetail(studentIdNum, detailParams)
    return {
      items: data.records,
      meta: {
        page: params.page || 1,
        per_page: params.per_page || 10,
        total: data.records.length,
        total_pages: 1,
      },
    }
  }

  if (isLoading) {
    return (
      <div className="flex w-full flex-col gap-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-bold tracking-tight">
              Detail Presensi Siswa
            </h1>
            <p className="text-sm text-muted-foreground">Memuat data...</p>
          </div>
        </div>
        <Card>
          <CardContent className="pt-6">
            <div className="animate-pulse space-y-4">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {[1, 2, 3, 4].map((i) => (
                  <Card key={i}>
                    <CardContent className="pt-6 h-24" />
                  </Card>
                ))}
              </div>
              <div className="h-64" />
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!detail) {
    return (
      <div className="flex w-full flex-col gap-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-bold tracking-tight">
              Detail Presensi Siswa
            </h1>
            <p className="text-sm text-muted-foreground">
              Data tidak ditemukan
            </p>
          </div>
        </div>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <Typography variant="muted" className="text-muted-foreground">
                Tidak dapat memuat data presensi siswa ini.
              </Typography>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const { student, summary, records } = detail

  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() =>
              navigate({
                to: '/dashboard/attendance-recap',
                search: (prev: Record<string, unknown>) => prev,
              })
            }
            className="w-fit"
          >
            <IconArrowLeft className="size-4" />
            <span>Kembali</span>
          </Button>
          <h1 className="text-2xl font-bold tracking-tight">
            Detail Presensi Siswa
          </h1>
          <p className="text-sm text-muted-foreground">
            Riwayat kehadiran {student.user.name} (
            {student.user.identity_number})
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IconUser className="size-5" />
            Informasi Siswa
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <Typography variant="small" className="text-muted-foreground">
                Nama
              </Typography>
              <Typography variant="body" className="font-medium">
                {student.user.name}
              </Typography>
            </div>
            <div>
              <Typography variant="small" className="text-muted-foreground">
                NIS
              </Typography>
              <Typography variant="body" className="font-medium">
                {student.user.identity_number}
              </Typography>
            </div>
            <div>
              <Typography variant="small" className="text-muted-foreground">
                Email
              </Typography>
              <Typography variant="muted" className="text-muted-foreground">
                {student.user.email}
              </Typography>
            </div>
            <div>
              <Typography variant="small" className="text-muted-foreground">
                Jenis Kelamin
              </Typography>
              <Typography variant="body" className="font-medium capitalize">
                {student.gender.label}
              </Typography>
            </div>
          </div>
        </CardContent>
      </Card>

      <StudentAttendanceSummaryCards
        summary={summary as unknown as IStudentAttendanceSummary}
      />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IconCalendar className="size-5" />
            Riwayat Kehadiran Harian
          </CardTitle>
        </CardHeader>
        <CardContent>
          {records.length === 0 ? (
            <div className="text-center py-12">
              <Typography variant="muted" className="text-muted-foreground">
                Belum ada data presensi untuk periode ini.
              </Typography>
            </div>
          ) : (
            <DataTable
              columns={columns}
              queryKey={attendanceKeys.lists()}
              queryFn={queryFn}
              allowedSortBy={ATTENDANCE_SORT_BY}
              defaultSortBy={ATTENDANCE_DEFAULT_SORT_BY}
              defaultOrder={ATTENDANCE_DEFAULT_ORDER}
              perPageOptions={ATTENDANCE_PER_PAGE_OPTIONS}
              defaultFilters={ATTENDANCE_DEFAULT_FILTERS}
              filterSchema={attendanceFilterSchema}
              searchPlaceholder="Cari mata pelajaran..."
              syncWithQueryParams
              enableSearch={false}
              emptyTitle="Tidak ada data presensi"
              emptyDescription="Siswa ini belum memiliki catatan presensi pada periode terpilih."
            />
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export function StudentAttendanceDetailView() {
  return (
    <AttendanceProvider>
      <StudentAttendanceDetailContent />
    </AttendanceProvider>
  )
}
