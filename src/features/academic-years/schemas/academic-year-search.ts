import { createDataTableSearchSchema } from '@/components/data-table'

export const ACADEMIC_YEAR_FILTER_KEYS = ['semester', 'year'] as const

export const academicYearSearch = createDataTableSearchSchema({
  filterKeys: ACADEMIC_YEAR_FILTER_KEYS,
})
