import {
  DataTableFilterSelect,
  DataTableToolbar,
  useDataTableFilter,
} from '@/components/data-table'
import { SUBJECT_STATUS_OPTIONS } from '@/features/teacher-session/lib/teacher-session-table'

export function SubjectToolbar() {
  const status = useDataTableFilter<string>('status', { defaultValue: 'all' })
  return (
    <DataTableToolbar>
      <DataTableFilterSelect
        label="Status"
        placeholder="All statuses"
        options={[...SUBJECT_STATUS_OPTIONS]}
        value={status.value}
        onChange={status.setValue}
        className="w-full sm:w-44"
      />
    </DataTableToolbar>
  )
}
