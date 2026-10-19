import { IconSchool } from '@tabler/icons-react'
import { useTranslation } from 'react-i18next'

import { DataTable } from '@/components/data-table'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { StudentProvider } from '@/features/students/components/student-store'
import { useTeacherStudentColumns } from '@/features/students/components/teacher-student-columns'
import { TeacherStudentDetailDialog } from '@/features/students/components/teacher-student-detail-dialog'
import {
  NoHomeroomWarning,
  TeacherStudentError,
  TeacherStudentHeading,
  TeacherStudentSkeleton,
} from '@/features/students/components/teacher-student-states'
import { TeacherStudentToolbar } from '@/features/students/components/teacher-student-toolbar'
import { useHomeroom } from '@/features/students/hooks/use-homeroom'
import { homeroomKeys } from '@/features/students/lib/homeroom-query-options'
import {
  STUDENT_DEFAULT_FILTERS,
  STUDENT_DEFAULT_ORDER,
  STUDENT_DEFAULT_SORT_BY,
  STUDENT_PER_PAGE_OPTIONS,
  STUDENT_SORT_BY,
  studentFilterSchema,
} from '@/features/students/lib/student-table'
import { getHomeroomStudents } from '@/features/students/services/homeroom-api'
import { getErrorMessage } from '@/utils/error'

function HomeroomStudentContent() {
  const { t } = useTranslation()
  const columns = useTeacherStudentColumns()
  const homeroomQuery = useHomeroom()

  if (homeroomQuery.isLoading) {
    return <TeacherStudentSkeleton />
  }

  if (homeroomQuery.isError) {
    return (
      <TeacherStudentError
        message={getErrorMessage(
          homeroomQuery.error,
          'Failed to load homeroom data.',
        )}
        onRetry={() => homeroomQuery.refetch()}
      />
    )
  }

  const homeroom = homeroomQuery.data
  if (!homeroom?.has_homeroom || !homeroom.class) {
    return <NoHomeroomWarning />
  }

  return (
    <div className="flex w-col flex-col gap-6 w-full">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <TeacherStudentHeading
          title={t('homeroomStudents.title')}
          description={t('homeroomStudents.description')}
        />
        <Badge variant="secondary" className="w-fit gap-1">
          <IconSchool className="size-4" />
          <span>{homeroom.class.name}</span>
        </Badge>
      </div>

      <Card>
        <CardHeader className="sr-only">
          <CardTitle>{t('homeroomStudents.title')}</CardTitle>
          <CardDescription>{t('homeroomStudents.description')}</CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            queryKey={homeroomKeys.studentLists()}
            queryFn={getHomeroomStudents}
            allowedSortBy={STUDENT_SORT_BY}
            defaultSortBy={STUDENT_DEFAULT_SORT_BY}
            defaultOrder={STUDENT_DEFAULT_ORDER}
            perPageOptions={STUDENT_PER_PAGE_OPTIONS}
            defaultFilters={STUDENT_DEFAULT_FILTERS}
            filterSchema={studentFilterSchema}
            toolbar={<TeacherStudentToolbar />}
            searchPlaceholder={t('teacherSession.searchStudent')}
            emptyTitle={t('classrooms.noStudentsYet')}
            emptyDescription={t('homeroomStudents.noStudentsInClass')}
            errorMessage={t('errors.loadError')}
            syncWithQueryParams
          />
        </CardContent>
      </Card>

      <TeacherStudentDetailDialog />
    </div>
  )
}

export function TeacherStudentView() {
  return (
    <StudentProvider>
      <HomeroomStudentContent />
    </StudentProvider>
  )
}
