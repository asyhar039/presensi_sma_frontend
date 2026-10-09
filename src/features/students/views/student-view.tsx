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
import { useStudentColumns } from '@/features/students/components/student-columns'
import { StudentDialog } from '@/features/students/components/student-dialog'
import {
  StudentProvider,
  useStudentStore,
} from '@/features/students/components/student-store'
import { StudentToolbar } from '@/features/students/components/student-toolbar'
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

function StudentContent() {
  const openCreate = useStudentStore((state) => state.openCreate)
  const columns = useStudentColumns()

  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold tracking-tight">Students</h1>
          <p className="text-sm text-muted-foreground">
            Manage student accounts, profiles, and statuses.
          </p>
        </div>
        <Button onClick={openCreate} className="w-full sm:w-auto">
          <IconPlus />
          <span>New student</span>
        </Button>
      </div>

      <Card>
        <CardHeader className="sr-only">
          <CardTitle>Students</CardTitle>
          <CardDescription>List of students</CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            queryKey={studentKeys.lists()}
            queryFn={getStudents}
            allowedSortBy={STUDENT_SORT_BY}
            defaultSortBy={STUDENT_DEFAULT_SORT_BY}
            defaultOrder={STUDENT_DEFAULT_ORDER}
            perPageOptions={STUDENT_PER_PAGE_OPTIONS}
            defaultFilters={STUDENT_DEFAULT_FILTERS}
            filterSchema={studentFilterSchema}
            toolbar={<StudentToolbar />}
            searchPlaceholder="Search students..."
            syncWithQueryParams
          />
        </CardContent>
      </Card>

      <StudentDialog />
    </div>
  )
}

export function StudentView() {
  return (
    <StudentProvider>
      <StudentContent />
    </StudentProvider>
  )
}
