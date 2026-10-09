import {
  DataTableFilterSelect,
  DataTableToolbar,
  useDataTableFilter,
} from '@/components/data-table'
import {
  TEACHER_EMPLOYMENT_STATUS_OPTIONS,
  TEACHER_GENDER_OPTIONS,
} from '@/features/teachers/lib/teacher-table'

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
      options={TEACHER_GENDER_OPTIONS}
      className="sm:w-36"
    />
  )
}

function EmploymentStatusFilterSelect() {
  const { value, setValue } = useDataTableFilter<string>('employment_status', {
    defaultValue: 'all',
  })

  return (
    <DataTableFilterSelect
      label="Employment Status"
      placeholder="All statuses"
      value={value}
      onChange={setValue}
      options={TEACHER_EMPLOYMENT_STATUS_OPTIONS}
      className="sm:w-40"
    />
  )
}

export function TeacherToolbar() {
  return (
    <DataTableToolbar searchPlaceholder="Search name or identity number...">
      <GenderFilterSelect />
      <EmploymentStatusFilterSelect />
    </DataTableToolbar>
  )
}
