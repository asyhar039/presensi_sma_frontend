import { DataTable } from '@/components/data-table'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { useAuth } from '@/context/auth-context'
import { StudentProvider } from '@/features/students/components/student-store'
import { useTeacherStudentColumns } from '@/features/students/components/teacher-student-columns'
import { TeacherStudentToolbar } from '@/features/students/components/teacher-student-toolbar'
import { studentKeys } from '@/features/students/lib/student-query-options'
import {
  STUDENT_DEFAULT_FILTERS,
  STUDENT_DEFAULT_ORDER,
  STUDENT_DEFAULT_SORT_BY,
  STUDENT_PER_PAGE_OPTIONS,
  STUDENT_SORT_BY,
  studentFilterSchema,
} from '@/features/students/lib/student-table'
import { getStudents } from '@/features/students/services/student-api'

function TeacherStudentContent() {
  const { user } = useAuth()
  const columns = useTeacherStudentColumns()

  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold tracking-tight">Data Siswa</h1>
          <p className="text-sm text-muted-foreground">
            Kelola dan pantau data siswa dalam kelas yang Anda ampu.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader className="sr-only">
          <CardTitle>Students</CardTitle>
          <CardDescription>List of students in your classes</CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            queryKey={studentKeys.lists()}
            queryFn={(params) =>
              getStudents({
                ...params,
                teacher_id: user?.id,
              })
            }
            allowedSortBy={STUDENT_SORT_BY}
            defaultSortBy={STUDENT_DEFAULT_SORT_BY}
            defaultOrder={STUDENT_DEFAULT_ORDER}
            perPageOptions={STUDENT_PER_PAGE_OPTIONS}
            defaultFilters={STUDENT_DEFAULT_FILTERS}
            filterSchema={studentFilterSchema}
            toolbar={<TeacherStudentToolbar />}
            searchPlaceholder="Cari nama atau NIS..."
            syncWithQueryParams
          />
        </CardContent>
      </Card>
    </div>
  )
}

export function TeacherStudentView() {
  return (
    <StudentProvider>
      <TeacherStudentContent />
    </StudentProvider>
  )
}
