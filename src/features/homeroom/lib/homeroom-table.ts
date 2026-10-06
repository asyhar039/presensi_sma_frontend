import * as v from 'valibot'

export const HOMEROOM_SORT_BY = ['id', 'requested_at', 'date'] as const
export const HOMEROOM_DEFAULT_SORT_BY = 'requested_at'
export const HOMEROOM_DEFAULT_ORDER = 'desc' as const
export const HOMEROOM_PER_PAGE_OPTIONS = [10, 20, 30, 50]

export const homeroomFilterSchema = v.object({
  type: v.optional(
    v.picklist(['all', 'sick_leave', 'early_out', 'late_arrival']),
  ),
  status: v.optional(v.picklist(['all', 'pending', 'approved', 'rejected'])),
})

export type HomeroomFilters = v.InferOutput<typeof homeroomFilterSchema>

export const HOMEROOM_DEFAULT_FILTERS: HomeroomFilters = {
  type: 'all',
  status: 'all',
}

export const HOMEROOM_TYPE_OPTIONS = [
  { label: 'All types', value: 'all' },
  { label: 'Sick Leave', value: 'sick_leave' },
  { label: 'Early Out', value: 'early_out' },
  { label: 'Late Arrival', value: 'late_arrival' },
] as const

export const HOMEROOM_STATUS_OPTIONS = [
  { label: 'All statuses', value: 'all' },
  { label: 'Pending', value: 'pending' },
  { label: 'Approved', value: 'approved' },
  { label: 'Rejected', value: 'rejected' },
] as const
