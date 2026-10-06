import { DataTableToolbar, useDataTableFilter } from '@/components/data-table'
import { Input } from '@/components/ui/input'
import { strToNumber } from '@/utils/string'

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
      <YearFilterInput />
    </DataTableToolbar>
  )
}
