import * as v from 'valibot'

export const TEACHER_RECAP_SORT_BY = ['id', 'name', 'created_at'] as const
export const TEACHER_RECAP_DEFAULT_SORT_BY = 'name'
export const TEACHER_RECAP_DEFAULT_ORDER = 'asc' as const
export const TEACHER_RECAP_PER_PAGE_OPTIONS = [10, 20, 30, 50]

export const teacherRecapFilterSchema = v.object({
  classroom_id: v.optional(v.string()),
  semester: v.optional(v.string()),
})

export type TeacherRecapFilters = v.InferOutput<typeof teacherRecapFilterSchema>

export const TEACHER_RECAP_DEFAULT_FILTERS: TeacherRecapFilters = {
  classroom_id: '',
  semester: 'all',
}

export const TEACHER_SEMESTER_OPTIONS = [
  { label: 'All semesters', value: 'all' },
  { label: 'Odd semester', value: 'odd' },
  { label: 'Even semester', value: 'even' },
]
