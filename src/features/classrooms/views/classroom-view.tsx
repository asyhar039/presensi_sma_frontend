import { IconPlus } from '@tabler/icons-react'
import { useTranslation } from 'react-i18next'

import { DataTable } from '@/components/data-table'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { useClassroomColumns } from '@/features/classrooms/components/classroom-columns'
import { ClassroomDialog } from '@/features/classrooms/components/classroom-dialog'
import {
  ClassroomProvider,
  useClassroomStore,
} from '@/features/classrooms/components/classroom-store'
import { ClassroomToolbar } from '@/features/classrooms/components/classroom-toolbar'
import { classroomKeys } from '@/features/classrooms/lib/classroom-query-options'
import {
  CLASSROOM_DEFAULT_FILTERS,
  CLASSROOM_DEFAULT_ORDER,
  CLASSROOM_DEFAULT_SORT_BY,
  CLASSROOM_PER_PAGE_OPTIONS,
  CLASSROOM_SORT_BY,
  classroomFilterSchema,
} from '@/features/classrooms/lib/classroom-table'
import { getClassrooms } from '@/features/classrooms/services/classroom-api'

function ClassroomContent() {
  const { t } = useTranslation()
  const openCreate = useClassroomStore((state) => state.openCreate)
  const columns = useClassroomColumns()

  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold tracking-tight">
            {t('classrooms.title')}
          </h1>
          <p className="text-sm text-muted-foreground">
            {t('classrooms.subtitle')}
          </p>
        </div>
        <Button onClick={openCreate} className="w-full sm:w-auto">
          <IconPlus />
          <span>{t('classrooms.add')}</span>
        </Button>
      </div>

      <Card>
        <CardHeader className="sr-only">
          <CardTitle>{t('classrooms.title')}</CardTitle>
          <CardDescription>{t('classrooms.subtitle')}</CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            queryKey={classroomKeys.lists()}
            queryFn={getClassrooms}
            allowedSortBy={CLASSROOM_SORT_BY}
            defaultSortBy={CLASSROOM_DEFAULT_SORT_BY}
            defaultOrder={CLASSROOM_DEFAULT_ORDER}
            perPageOptions={CLASSROOM_PER_PAGE_OPTIONS}
            defaultFilters={CLASSROOM_DEFAULT_FILTERS}
            filterSchema={classroomFilterSchema}
            toolbar={<ClassroomToolbar />}
            searchPlaceholder={t('common.search')}
            syncWithQueryParams
          />
        </CardContent>
      </Card>

      <ClassroomDialog />
    </div>
  )
}

export function ClassroomView() {
  return (
    <ClassroomProvider>
      <ClassroomContent />
    </ClassroomProvider>
  )
}
