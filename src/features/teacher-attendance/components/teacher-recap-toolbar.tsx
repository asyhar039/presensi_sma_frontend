import { ApiCombobox } from '@/components/composite/api-combobox'
import {
  DataTableFilterSelect,
  DataTableToolbar,
  useDataTableFilter,
} from '@/components/data-table'
import { Label } from '@/components/ui/label'
import { TEACHER_SEMESTER_OPTIONS } from '@/features/teacher-attendance/lib/teacher-attendance-table'
import {
  getTeachingClassroomDropdown,
  getTeachingClassroomDropdownSelected,
} from '@/features/teacher-attendance/services/teacher-attendance-api'

function ClassroomFilter() {
  const { value, setValue } = useDataTableFilter<string>('classroom_id', {
    defaultValue: '',
  })

  return (
    <div className="flex w-full flex-col gap-1.5 sm:w-52">
      <Label className="sr-only">Class</Label>
      <ApiCombobox
        queryKey="teacher-classrooms-dropdown"
        queryFn={getTeachingClassroomDropdown}
        selectedQueryFn={getTeachingClassroomDropdownSelected}
        placeholder="Select class..."
        value={value || undefined}
        onValueChange={(next) => setValue(next ?? '')}
      />
    </div>
  )
}

function SemesterFilter() {
  const { value, setValue } = useDataTableFilter<string>('semester', {
    defaultValue: 'all',
  })

  return (
    <DataTableFilterSelect
      label="Semester"
      placeholder="All semesters"
      options={[...TEACHER_SEMESTER_OPTIONS]}
      value={value || 'all'}
      onChange={(next) => setValue(next === 'all' ? '' : next)}
      className="w-full sm:w-44"
    />
  )
}

export function TeacherRecapToolbar() {
  return (
    <DataTableToolbar searchPlaceholder="Search by student name or ID number...">
      <ClassroomFilter />
      <SemesterFilter />
    </DataTableToolbar>
  )
}
