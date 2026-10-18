import { useQuery } from '@tanstack/react-query'

import {
  DataTableFilterSelect,
  DataTableToolbar,
  useDataTableFilter,
} from '@/components/data-table'
import { formatAcademicLabel } from '@/features/academic-years/components/academic-year-columns'
import { academicYearsQueryOptions } from '@/features/academic-years/lib/academic-year-query-options'
import { DUTY_DAY_OPTIONS } from '@/features/duty-teacher/assignments/schema'

function AcademicYearFilter() {
  const { value, setValue } = useDataTableFilter<string>('academic_year_id', {
    defaultValue: '',
  })
  const query = useQuery(academicYearsQueryOptions({ page: 1, per_page: 50 }))
  const options = [
    { label: 'All academic years', value: '' },
    ...(query.data?.items ?? []).map((item) => ({
      label: formatAcademicLabel(item),
      value: String(item.id),
    })),
  ]
  return (
    <DataTableFilterSelect
      label="Academic Year"
      placeholder="All academic years"
      value={value}
      onChange={setValue}
      options={options}
      disabled={query.isLoading}
      className="sm:w-48"
    />
  )
}

function DayFilter() {
  const { value, setValue } = useDataTableFilter<string>('day', {
    defaultValue: '',
  })
  return (
    <DataTableFilterSelect
      label="Day"
      placeholder="All days"
      value={value}
      onChange={setValue}
      options={[{ label: 'All days', value: '' }, ...DUTY_DAY_OPTIONS]}
      className="w-full sm:w-40"
    />
  )
}

export function DutyAssignmentToolbar() {
  return (
    <DataTableToolbar searchPlaceholder="Search teacher name...">
      <AcademicYearFilter />
      <DayFilter />
    </DataTableToolbar>
  )
}
