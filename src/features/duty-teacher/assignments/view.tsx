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
import { useDutyAssignmentColumns } from '@/features/duty-teacher/assignments/columns'
import { DutyAssignmentDialog } from '@/features/duty-teacher/assignments/dialogs'
import { dutyAssignmentKeys } from '@/features/duty-teacher/assignments/query'
import {
  DUTY_ASSIGNMENT_DEFAULT_FILTERS,
  DUTY_ASSIGNMENT_DEFAULT_ORDER,
  DUTY_ASSIGNMENT_DEFAULT_SORT_BY,
  DUTY_ASSIGNMENT_PER_PAGE_OPTIONS,
  DUTY_ASSIGNMENT_SORT_BY,
  dutyAssignmentFilterSchema,
} from '@/features/duty-teacher/assignments/schema'
import { getDutyAssignments } from '@/features/duty-teacher/assignments/services'
import {
  DutyAssignmentProvider,
  useDutyAssignmentStore,
} from '@/features/duty-teacher/assignments/store'
import { DutyAssignmentToolbar } from '@/features/duty-teacher/assignments/toolbar'

function DutyAssignmentContent() {
  const openCreate = useDutyAssignmentStore((state) => state.openCreate)
  const columns = useDutyAssignmentColumns()

  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold tracking-tight">Duty Teachers</h1>
          <p className="text-sm text-muted-foreground">
            Manage weekly duty teacher assignments.
          </p>
        </div>
        <Button onClick={openCreate} className="w-full sm:w-auto">
          <IconPlus />
          <span>New duty teacher</span>
        </Button>
      </div>

      <Card>
        <CardHeader className="sr-only">
          <CardTitle>Duty teachers</CardTitle>
          <CardDescription>List of duty teacher assignments</CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            queryKey={dutyAssignmentKeys.lists()}
            queryFn={getDutyAssignments}
            allowedSortBy={DUTY_ASSIGNMENT_SORT_BY}
            defaultSortBy={DUTY_ASSIGNMENT_DEFAULT_SORT_BY}
            defaultOrder={DUTY_ASSIGNMENT_DEFAULT_ORDER}
            perPageOptions={DUTY_ASSIGNMENT_PER_PAGE_OPTIONS}
            defaultFilters={DUTY_ASSIGNMENT_DEFAULT_FILTERS}
            filterSchema={dutyAssignmentFilterSchema}
            toolbar={<DutyAssignmentToolbar />}
            searchPlaceholder="Search teacher name..."
            emptyTitle="No duty teachers"
            emptyDescription="No duty teacher assignments yet. Create one to get started."
            errorMessage="Failed to load duty teachers."
            syncWithQueryParams
          />
        </CardContent>
      </Card>

      <DutyAssignmentDialog />
    </div>
  )
}

export function DutyAssignmentView() {
  return (
    <DutyAssignmentProvider>
      <DutyAssignmentContent />
    </DutyAssignmentProvider>
  )
}
