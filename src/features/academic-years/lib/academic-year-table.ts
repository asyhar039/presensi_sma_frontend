import * as v from 'valibot'

export const ACADEMIC_YEAR_SORT_BY = [
  'id',
  'odd_start_date',
  'odd_end_date',
  'even_start_date',
  'even_end_date',
  'is_active',
  'created_at',
] as const

export const ACADEMIC_YEAR_DEFAULT_SORT_BY = 'created_at'
export const ACADEMIC_YEAR_DEFAULT_ORDER = 'desc' as const
export const ACADEMIC_YEAR_PER_PAGE_OPTIONS = [10, 20, 30, 50]

export const academicYearFilterSchema = v.object({
  year: v.optional(
    v.pipe(
      v.union([v.number(), v.string()]),
      v.transform((value) => Number(value)),
      v.number('Year must be a number.'),
      v.integer('Year must be a whole number.'),
      v.minValue(1900, 'Year must be between 1900 and 2100.'),
      v.maxValue(2100, 'Year must be between 1900 and 2100.'),
    ),
  ),
})

export type AcademicYearFilters = v.InferOutput<typeof academicYearFilterSchema>

export const ACADEMIC_YEAR_DEFAULT_FILTERS: AcademicYearFilters = {
  year: undefined,
}
