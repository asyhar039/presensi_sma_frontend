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
import { useSubjectColumns } from '@/features/subjects/components/subject-columns'
import { SubjectDialog } from '@/features/subjects/components/subject-dialog'
import {
  SubjectProvider,
  useSubjectStore,
} from '@/features/subjects/components/subject-store'
import { subjectKeys } from '@/features/subjects/lib/subject-query-options'
import {
  SUBJECT_DEFAULT_ORDER,
  SUBJECT_DEFAULT_SORT_BY,
  SUBJECT_PER_PAGE_OPTIONS,
  SUBJECT_SORT_BY,
} from '@/features/subjects/lib/subject-table'
import { getSubjects } from '@/features/subjects/services/subject-api'

function SubjectContent() {
  const { t } = useTranslation()
  const openCreate = useSubjectStore((state) => state.openCreate)
  const columns = useSubjectColumns()

  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold tracking-tight">
            {t('subjects.title')}
          </h1>
          <p className="text-sm text-muted-foreground">
            {t('subjects.subtitle')}
          </p>
        </div>
        <Button onClick={openCreate} className="w-full sm:w-auto">
          <IconPlus />
          <span>{t('subjects.add')}</span>
        </Button>
      </div>

      <Card>
        <CardHeader className="sr-only">
          <CardTitle>{t('subjects.title')}</CardTitle>
          <CardDescription>{t('subjects.subtitle')}</CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            queryKey={subjectKeys.lists()}
            queryFn={getSubjects}
            allowedSortBy={SUBJECT_SORT_BY}
            defaultSortBy={SUBJECT_DEFAULT_SORT_BY}
            defaultOrder={SUBJECT_DEFAULT_ORDER}
            perPageOptions={SUBJECT_PER_PAGE_OPTIONS}
            searchPlaceholder={t('common.search')}
            syncWithQueryParams
          />
        </CardContent>
      </Card>

      <SubjectDialog />
    </div>
  )
}

export function SubjectView() {
  return (
    <SubjectProvider>
      <SubjectContent />
    </SubjectProvider>
  )
}
