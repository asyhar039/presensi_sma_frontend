import type { DataTableFilterDef } from '@/components/data-table'

export const ACADEMIC_YEAR_SORT_BY = [
  'id',
  'start_date',
  'end_date',
  'semester',
  'is_active',
  'created_at',
] as const

export const ACADEMIC_YEAR_DEFAULT_SORT_BY = 'created_at'
export const ACADEMIC_YEAR_DEFAULT_ORDER = 'desc' as const
export const ACADEMIC_YEAR_PER_PAGE_OPTIONS = [10, 20, 30, 50]

function isValidYear(value: string): boolean {
  if (value === '') return true
  if (!/^\d{1,4}$/.test(value)) return false
  const year = Number(value)
  return year >= 1900 && year <= 2100
}

export const ACADEMIC_YEAR_FILTER_DEFS: DataTableFilterDef[] = [
  {
    key: 'semester',
    label: 'Semester',
    placeholder: 'All semesters',
    defaultValue: 'all',
    allowedValues: ['all', 'odd', 'even'],
    options: [
      { label: 'All semesters', value: 'all' },
      { label: 'Odd', value: 'odd' },
      { label: 'Even', value: 'even' },
    ],
  },
  {
    key: 'year',
    label: 'Year',
    placeholder: 'Year',
    defaultValue: '',
    validate: isValidYear,
  },
]
