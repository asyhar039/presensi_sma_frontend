import { useQuery } from '@tanstack/react-query'

import {
  DataTableFilterSelect,
  DataTableToolbar,
  useDataTableFilter,
} from '@/components/data-table'
import { formatAcademicLabel } from '@/features/academic-years/components/academic-year-columns'
import { academicYearsQueryOptions } from '@/features/academic-years/lib/academic-year-query-options'

function AcademicYearFilterSelect() {
  const { value, setValue } = useDataTableFilter<string>('academic_year_id', {
    defaultValue: 'all',
  })
  const academicYearsQuery = useQuery(
    academicYearsQueryOptions({ page: 1, per_page: 50 }),
  )
  const options = [
    { label: 'All academic years', value: 'all' },
    ...(academicYearsQuery.data?.items ?? []).map((item) => ({
      label: `${formatAcademicLabel(item)} (${item.semester})`,
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
      disabled={academicYearsQuery.isLoading}
      className="sm:w-48"
    />
  )
}

export function ClassroomToolbar() {
  return (
    <DataTableToolbar searchPlaceholder="Search classrooms...">
      <AcademicYearFilterSelect />
    </DataTableToolbar>
  )
}
