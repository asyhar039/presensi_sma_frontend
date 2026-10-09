import * as v from 'valibot'

export const DUTY_SORT_BY = ['id', 'requested_at', 'date'] as const
export const DUTY_DEFAULT_SORT_BY = 'requested_at'
export const DUTY_DEFAULT_ORDER = 'desc' as const
export const DUTY_PER_PAGE_OPTIONS = [10, 20, 30, 50]

export const dutyFilterSchema = v.object({
  status: v.optional(v.picklist(['all', 'pending', 'approved', 'rejected'])),
})

export type DutyFilters = v.InferOutput<typeof dutyFilterSchema>

export const DUTY_DEFAULT_FILTERS: DutyFilters = { status: 'all' }

export const DUTY_STATUS_OPTIONS = [
  { label: 'All statuses', value: 'all' },
  { label: 'Pending', value: 'pending' },
  { label: 'Approved', value: 'approved' },
  { label: 'Rejected', value: 'rejected' },
] as const
