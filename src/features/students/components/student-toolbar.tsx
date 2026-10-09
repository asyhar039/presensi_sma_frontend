import {
  DataTableFilterSelect,
  DataTableToolbar,
  useDataTableFilter,
} from '@/components/data-table'
import {
  STUDENT_GENDER_OPTIONS,
  STUDENT_STATUS_OPTIONS,
} from '@/features/students/lib/student-table'

function GenderFilterSelect() {
  const { value, setValue } = useDataTableFilter<string>('gender', {
    defaultValue: 'all',
  })

  return (
    <DataTableFilterSelect
      label="Gender"
      placeholder="All genders"
      value={value}
      onChange={setValue}
      options={STUDENT_GENDER_OPTIONS}
      className="sm:w-36"
    />
  )
}

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
      options={STUDENT_STATUS_OPTIONS}
      className="sm:w-40"
    />
  )
}

export function StudentToolbar() {
  return (
    <DataTableToolbar searchPlaceholder="Search name or identity number...">
      <GenderFilterSelect />
      <StatusFilterSelect />
    </DataTableToolbar>
  )
}
