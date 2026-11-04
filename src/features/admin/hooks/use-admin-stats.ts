import { useQuery } from '@tanstack/react-query'

import { classroomsQueryOptions } from '@/features/classrooms/lib/classroom-query-options'
import { permitStatisticsQueryOptions } from '@/features/permits/lib/permit-query-options'
import { getAttendanceReportSummary } from '@/features/reports/services/report-api'
import { getStudents } from '@/features/students/services/student-api'
import { subjectsQueryOptions } from '@/features/subjects/lib/subject-query-options'
import { getTeachers } from '@/features/teachers/services/teacher-api'

export function useAdminStats() {
  const month = new Date().getMonth() + 1
  const year = new Date().getFullYear()

  const studentsQuery = useQuery({
    queryKey: ['students', { per_page: 1 }],
    queryFn: () =>
      getStudents({
        page: 1,
        per_page: 1,
      }),
  })

  const teachersQuery = useQuery({
    queryKey: ['teachers', { per_page: 1 }],
    queryFn: () =>
      getTeachers({
        page: 1,
        per_page: 1,
      }),
  })

  const subjectsQuery = useQuery(subjectsQueryOptions({ page: 1, per_page: 1 }))

  const classroomsQuery = useQuery(
    classroomsQueryOptions({ page: 1, per_page: 1 }),
  )

  const attendanceReportQuery = useQuery({
    queryKey: [
      'report',
      'attendance-summary',
      { month, year, classroom_id: 'all' },
    ],
    queryFn: () =>
      getAttendanceReportSummary({
        month,
        year,
        classroom_id: 'all',
      }),
  })

  const permitStatisticsQuery = useQuery(permitStatisticsQueryOptions())

  return {
    totalStudents: studentsQuery.data?.meta.total ?? null,
    totalTeachers: teachersQuery.data?.meta.total ?? null,
    totalSubjects: subjectsQuery.data?.meta.total ?? null,
    totalClassrooms: classroomsQuery.data?.meta.total ?? null,
    attendanceReport: attendanceReportQuery.data ?? null,
    permitStatistics: permitStatisticsQuery.data ?? null,
    loading: {
      students: studentsQuery.isLoading,
      teachers: teachersQuery.isLoading,
      subjects: subjectsQuery.isLoading,
      classrooms: classroomsQuery.isLoading,
      attendanceReport: attendanceReportQuery.isLoading,
      permitStatistics: permitStatisticsQuery.isLoading,
    },
    errors: {
      students: studentsQuery.isError,
      teachers: teachersQuery.isError,
      subjects: subjectsQuery.isError,
      classrooms: classroomsQuery.isError,
      attendanceReport: attendanceReportQuery.isError,
      permitStatistics: permitStatisticsQuery.isError,
    },
  }
}
