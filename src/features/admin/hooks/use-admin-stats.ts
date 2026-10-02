import { useQuery } from '@tanstack/react-query'

import { getAttendanceSummary } from '@/features/attendance/services/attendance-api'
import { getStudents } from '@/features/students/services/student-api'
import { getTeachers } from '@/features/teachers/services/teacher-api'

export function useAdminStats() {
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

  const attendanceSummaryQuery = useQuery({
    queryKey: ['attendance-summary'],
    queryFn: () =>
      getAttendanceSummary({
        classroom_id: 1,
        month: new Date().getMonth() + 1,
        semester: 'ganjil',
      }),
  })

  const totalStudents = studentsQuery.data?.meta.total ?? 0
  const totalTeachers = teachersQuery.data?.meta.total ?? 0
  const attendanceSummary = attendanceSummaryQuery.data

  const attendancePercentage = attendanceSummary
    ? attendanceSummary.average_attendance
    : 0

  const isLoading =
    studentsQuery.isLoading ||
    teachersQuery.isLoading ||
    attendanceSummaryQuery.isLoading

  return {
    totalStudents,
    totalTeachers,
    attendancePercentage,
    attendanceSummary,
    isLoading,
  }
}
