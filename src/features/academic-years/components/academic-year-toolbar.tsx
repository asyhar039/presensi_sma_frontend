import { DataTableToolbar, useDataTableFilter } from '@/components/data-table'
import { Input } from '@/components/ui/input'

function YearFilterInput() {
  const { value, setValue } = useDataTableFilter('year')

  return (
    <Input
      type="number"
      inputMode="numeric"
      min={1900}
      max={2100}
      value={value}
      onChange={(event) => setValue(event.target.value)}
      placeholder="Year"
      aria-label="Filter by year"
      className="w-full sm:w-28"
    />
  )
}

export function AcademicYearToolbar() {
  return (
    <DataTableToolbar searchPlaceholder="Search academic years...">
      <YearFilterInput />
    </DataTableToolbar>
  )
}
