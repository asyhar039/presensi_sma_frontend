import * as v from 'valibot'

export const SUBJECT_SORT_BY = ['id', 'requested_at', 'date'] as const
export const SUBJECT_DEFAULT_SORT_BY = 'requested_at'
export const SUBJECT_DEFAULT_ORDER = 'desc' as const
export const SUBJECT_PER_PAGE_OPTIONS = [10, 20, 30, 50]

export const subjectFilterSchema = v.object({
  status: v.optional(v.picklist(['all', 'pending', 'approved', 'rejected'])),
})
export type SubjectFilters = v.InferOutput<typeof subjectFilterSchema>
export const SUBJECT_DEFAULT_FILTERS: SubjectFilters = { status: 'all' }
export const SUBJECT_STATUS_OPTIONS = [
  { label: 'All statuses', value: 'all' },
  { label: 'Pending', value: 'pending' },
  { label: 'Approved', value: 'approved' },
  { label: 'Rejected', value: 'rejected' },
] as const
