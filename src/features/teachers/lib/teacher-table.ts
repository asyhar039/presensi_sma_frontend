import * as v from 'valibot'

export const TEACHER_SORT_BY = ['id', 'name', 'created_at'] as const

export const TEACHER_DEFAULT_SORT_BY = 'created_at'
export const TEACHER_DEFAULT_ORDER = 'desc' as const
export const TEACHER_PER_PAGE_OPTIONS = [10, 20, 30, 50]

export const teacherFilterSchema = v.object({
  gender: v.picklist(['all', 'male', 'female']),
  employment_status: v.picklist(['all', 'pns', 'pppk', 'honorer']),
})

export type TeacherFilters = v.InferOutput<typeof teacherFilterSchema>

export const TEACHER_DEFAULT_FILTERS: TeacherFilters = {
  gender: 'all',
  employment_status: 'all',
}

export const TEACHER_GENDER_OPTIONS = [
  { label: 'All genders', value: 'all' },
  { label: 'Male', value: 'male' },
  { label: 'Female', value: 'female' },
]

export const TEACHER_EMPLOYMENT_STATUS_OPTIONS = [
  { label: 'All statuses', value: 'all' },
  { label: 'PNS', value: 'pns' },
  { label: 'PPPK', value: 'pppk' },
  { label: 'Honorer', value: 'honorer' },
]

export const TEACHER_GENDER_FORM_OPTIONS = [
  { label: 'Male', value: 'male' },
  { label: 'Female', value: 'female' },
]

export const TEACHER_EMPLOYMENT_STATUS_FORM_OPTIONS = [
  { label: 'PNS', value: 'pns' },
  { label: 'PPPK', value: 'pppk' },
  { label: 'Honorer', value: 'honorer' },
]
