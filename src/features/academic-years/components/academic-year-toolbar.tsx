import type { DataTableFilter } from '@/components/data-table'

import { useMemo } from 'react'

import { DataTableToolbar } from '@/components/data-table'
import { Input } from '@/components/ui/input'

export interface AcademicYearToolbarProps {
  search: string
  onSearchChange: (value: string) => void
  semester: string
  onSemesterChange: (value: string) => void
  year: string
  onYearChange: (value: string) => void
  onReset: () => void
}

export function AcademicYearToolbar({
  search,
  onSearchChange,
  semester,
  onSemesterChange,
  year,
  onYearChange,
  onReset,
}: AcademicYearToolbarProps) {
  const filters = useMemo<DataTableFilter[]>(
    () => [
      {
        key: 'semester',
        label: 'Semester',
        placeholder: 'All semesters',
        value: semester,
        options: [
          { label: 'All semesters', value: 'all' },
          { label: 'Odd', value: 'odd' },
          { label: 'Even', value: 'even' },
        ],
        onChange: onSemesterChange,
      },
    ],
    [semester, onSemesterChange],
  )

  return (
    <DataTableToolbar
      searchValue={search}
      searchPlaceholder="Search academic years..."
      onSearchChange={onSearchChange}
      filters={filters}
      onReset={onReset}
    >
      <Input
        type="number"
        inputMode="numeric"
        min={1900}
        max={2100}
        value={year}
        onChange={(event) => onYearChange(event.target.value)}
        placeholder="Year"
        aria-label="Filter by year"
        className="w-full sm:w-28"
      />
    </DataTableToolbar>
  )
}
