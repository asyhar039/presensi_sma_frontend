import {
  DataTableFilterSelect,
  DataTableToolbar,
  useDataTableFilter,
} from '@/components/data-table'
import { Input } from '@/components/ui/input'
import { ACADEMIC_YEAR_SEMESTER_OPTIONS } from '@/features/academic-years/lib/academic-year-table'
import { strToNumber } from '@/utils/string'

function SemesterFilterSelect() {
  const { value, setValue } = useDataTableFilter<string>('semester', {
    defaultValue: 'all',
  })

  return (
    <DataTableFilterSelect
      label="Semester"
      placeholder="All semesters"
      value={value}
      onChange={setValue}
      options={ACADEMIC_YEAR_SEMESTER_OPTIONS}
      className="sm:w-36"
    />
  )
}

function YearFilterInput() {
  const { value, setValue } = useDataTableFilter<number | undefined>('year', {
    defaultValue: undefined,
    debounceMs: 400,
  })

  return (
    <Input
      type="number"
      inputMode="numeric"
      min={1900}
      max={2100}
      value={value ?? ''}
      onChange={(event) => {
        setValue(strToNumber(event.target.value))
      }}
      placeholder="Year"
      aria-label="Filter by year"
      className="w-full sm:w-28"
    />
  )
}

export function AcademicYearToolbar() {
  return (
    <DataTableToolbar
      showSearch={false}
      searchPlaceholder="Search academic years..."
    >
      <SemesterFilterSelect />
      <YearFilterInput />
    </DataTableToolbar>
  )
}
