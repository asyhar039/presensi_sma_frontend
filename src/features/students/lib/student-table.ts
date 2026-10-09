import * as v from 'valibot'

export const STUDENT_SORT_BY = ['id', 'name', 'created_at'] as const

export const STUDENT_DEFAULT_SORT_BY = 'created_at'
export const STUDENT_DEFAULT_ORDER = 'desc' as const
export const STUDENT_PER_PAGE_OPTIONS = [10, 20, 30, 50]

export const studentFilterSchema = v.object({
  gender: v.picklist(['all', 'male', 'female']),
  status: v.picklist(['all', 'active', 'inactive', 'graduated', 'dropped_out']),
})

export type StudentFilters = v.InferOutput<typeof studentFilterSchema>

export const STUDENT_DEFAULT_FILTERS: StudentFilters = {
  gender: 'all',
  status: 'all',
}

export const STUDENT_GENDER_OPTIONS = [
  { label: 'All genders', value: 'all' },
  { label: 'Male', value: 'male' },
  { label: 'Female', value: 'female' },
]

export const STUDENT_STATUS_OPTIONS = [
  { label: 'All statuses', value: 'all' },
  { label: 'Active', value: 'active' },
  { label: 'Inactive', value: 'inactive' },
  { label: 'Graduated', value: 'graduated' },
  { label: 'Dropped Out', value: 'dropped_out' },
]

export const STUDENT_GENDER_FORM_OPTIONS = [
  { label: 'Male', value: 'male' },
  { label: 'Female', value: 'female' },
]

export const STUDENT_STATUS_FORM_OPTIONS = [
  { label: 'Active', value: 'active' },
  { label: 'Inactive', value: 'inactive' },
  { label: 'Graduated', value: 'graduated' },
  { label: 'Dropped Out', value: 'dropped_out' },
]
