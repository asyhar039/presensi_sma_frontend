import * as v from 'valibot'

export const CLASSROOM_SORT_BY = ['id', 'created_at'] as const

export const CLASSROOM_DEFAULT_SORT_BY = 'created_at'
export const CLASSROOM_DEFAULT_ORDER = 'desc' as const
export const CLASSROOM_PER_PAGE_OPTIONS = [10, 20, 30, 50]

export const classroomFilterSchema = v.object({
  academic_year_id: v.optional(
    v.union([v.picklist(['all']), v.number(), v.string()]),
    'all',
  ),
})

export type ClassroomFilters = v.InferOutput<typeof classroomFilterSchema>

export const CLASSROOM_DEFAULT_FILTERS: ClassroomFilters = {
  academic_year_id: 'all',
}
