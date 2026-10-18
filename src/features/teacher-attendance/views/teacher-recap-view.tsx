import type { ITeacherAttendanceParams } from '@/features/teacher-attendance/types/teacher-attendance.types'

import { DataTable } from '@/components/data-table'
import { Card, CardContent } from '@/components/ui/card'
import { useTeacherRecapColumns } from '@/features/teacher-attendance/components/teacher-recap-columns'
import { TeacherRecapToolbar } from '@/features/teacher-attendance/components/teacher-recap-toolbar'
import { teacherAttendanceKeys } from '@/features/teacher-attendance/lib/teacher-attendance-query-options'
import {
  TEACHER_RECAP_DEFAULT_FILTERS,
  TEACHER_RECAP_DEFAULT_ORDER,
  TEACHER_RECAP_DEFAULT_SORT_BY,
  TEACHER_RECAP_PER_PAGE_OPTIONS,
  TEACHER_RECAP_SORT_BY,
  teacherRecapFilterSchema,
} from '@/features/teacher-attendance/lib/teacher-attendance-table'
import { getTeacherStudentsHistory } from '@/features/teacher-attendance/services/teacher-attendance-api'

export function TeacherRecapView() {
  const columns = useTeacherRecapColumns()

  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight">Attendance Recap</h1>
        <p className="text-sm text-muted-foreground">
          Present, sick, permit, and absent counts for students in your classes
          over effective school days.
        </p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <DataTable
            columns={columns}
            queryKey={teacherAttendanceKeys.lists()}
            queryFn={async (params) => {
              const apiParams: ITeacherAttendanceParams = {}
              const classroomId = params.classroom_id
              if (classroomId) apiParams.classroom_id = Number(classroomId)
              const semester = params.semester
              if (semester) apiParams.semester = String(semester)
              if (params.search) apiParams.search = String(params.search)
              if (params.page) apiParams.page = Number(params.page)
              if (params.per_page) apiParams.per_page = Number(params.per_page)
              if (params.sortBy) apiParams.sortBy = String(params.sortBy)
              if (params.order) apiParams.order = String(params.order)
              return getTeacherStudentsHistory(apiParams)
            }}
            allowedSortBy={[...TEACHER_RECAP_SORT_BY]}
            defaultSortBy={TEACHER_RECAP_DEFAULT_SORT_BY}
            defaultOrder={TEACHER_RECAP_DEFAULT_ORDER}
            perPageOptions={TEACHER_RECAP_PER_PAGE_OPTIONS}
            defaultFilters={TEACHER_RECAP_DEFAULT_FILTERS}
            filterSchema={teacherRecapFilterSchema}
            toolbar={<TeacherRecapToolbar />}
            searchPlaceholder="Search by student name or ID number..."
            emptyTitle="No attendance data"
            emptyDescription="Try adjusting the filters or selecting another class."
            errorMessage="Failed to load attendance recap. Please try again."
            syncWithQueryParams
          />
        </CardContent>
      </Card>
    </div>
  )
}
