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
import { useTeacherColumns } from '@/features/teachers/components/teacher-columns'
import { TeacherDialog } from '@/features/teachers/components/teacher-dialog'
import {
  TeacherProvider,
  useTeacherStore,
} from '@/features/teachers/components/teacher-store'
import { TeacherToolbar } from '@/features/teachers/components/teacher-toolbar'
import { teacherKeys } from '@/features/teachers/lib/teacher-query-options'
import {
  TEACHER_DEFAULT_FILTERS,
  TEACHER_DEFAULT_ORDER,
  TEACHER_DEFAULT_SORT_BY,
  TEACHER_PER_PAGE_OPTIONS,
  TEACHER_SORT_BY,
  teacherFilterSchema,
} from '@/features/teachers/lib/teacher-table'
import { getTeachers } from '@/features/teachers/services/teacher-api'

function TeacherContent() {
  const openCreate = useTeacherStore((state) => state.openCreate)
  const columns = useTeacherColumns()

  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold tracking-tight">Teachers</h1>
          <p className="text-sm text-muted-foreground">
            Manage teacher accounts, profiles, and employment statuses.
          </p>
        </div>
        <Button onClick={openCreate} className="w-full sm:w-auto">
          <IconPlus />
          <span>New teacher</span>
        </Button>
      </div>

      <Card>
        <CardHeader className="sr-only">
          <CardTitle>Teachers</CardTitle>
          <CardDescription>List of teachers</CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            queryKey={teacherKeys.lists()}
            queryFn={getTeachers}
            allowedSortBy={TEACHER_SORT_BY}
            defaultSortBy={TEACHER_DEFAULT_SORT_BY}
            defaultOrder={TEACHER_DEFAULT_ORDER}
            perPageOptions={TEACHER_PER_PAGE_OPTIONS}
            defaultFilters={TEACHER_DEFAULT_FILTERS}
            filterSchema={teacherFilterSchema}
            toolbar={<TeacherToolbar />}
            searchPlaceholder="Search teachers..."
            syncWithQueryParams
          />
        </CardContent>
      </Card>

      <TeacherDialog />
    </div>
  )
}

export function TeacherView() {
  return (
    <TeacherProvider>
      <TeacherContent />
    </TeacherProvider>
  )
}
