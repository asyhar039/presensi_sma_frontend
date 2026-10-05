import {
  DataTableFilterSelect,
  DataTableToolbar,
  useDataTableFilter,
} from '@/components/data-table'
import { DUTY_STATUS_OPTIONS } from '@/features/duty-teacher/lib/duty-teacher-table'

export function DutyToolbar() {
  const status = useDataTableFilter<string>('status', { defaultValue: 'all' })
  return (
    <DataTableToolbar>
      <DataTableFilterSelect
        label="Status"
        placeholder="All statuses"
        options={[...DUTY_STATUS_OPTIONS]}
        value={status.value}
        onChange={status.setValue}
        className="w-full sm:w-44"
      />
    </DataTableToolbar>
  )
}
