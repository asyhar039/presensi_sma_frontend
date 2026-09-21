import {
  DataTableFilterSelect,
  DataTableToolbar,
  useDataTableFilter,
} from '@/components/data-table'
import { ATTENDANCE_STATUS_OPTIONS } from '@/features/attendance/lib/attendance-table'

function StatusFilterSelect() {
  const { value, setValue } = useDataTableFilter<string>('status', {
    defaultValue: 'all',
  })

  return (
    <DataTableFilterSelect
      label="Status"
      placeholder="All statuses"
      value={value}
      onChange={setValue}
      options={ATTENDANCE_STATUS_OPTIONS}
      className="sm:w-40"
    />
  )
}

export function AttendanceToolbar() {
  return (
    <DataTableToolbar searchPlaceholder="Search name or identity number...">
      <StatusFilterSelect />
    </DataTableToolbar>
  )
}
