import * as v from 'valibot'

export const PERMIT_SORT_BY = [
  'date',
  'student_name',
  'type',
  'status',
] as const
export const PERMIT_DEFAULT_SORT_BY = 'date'
export const PERMIT_DEFAULT_ORDER = 'desc' as const
export const PERMIT_PER_PAGE_OPTIONS = [10, 20, 30, 50]

export const permitFilterSchema = v.object({
  classroom_id: v.optional(v.string()),
  type: v.optional(v.string()),
  status: v.optional(v.picklist(['all', 'pending', 'approved', 'rejected'])),
})

export type PermitFilters = v.InferOutput<typeof permitFilterSchema>

export const PERMIT_DEFAULT_FILTERS: PermitFilters = {
  classroom_id: '',
  type: 'all',
  status: 'all',
}

export const PERMIT_TYPES = [
  { label: 'Semua Jenis', value: 'all' },
  { label: 'Izin Sakit', value: 'sick' },
  { label: 'Izin Keluar Sekolah', value: 'leave_school' },
  { label: 'Izin Masuk', value: 'leave_in' },
] as const

export const PERMIT_STATUS_OPTIONS = [
  { label: 'Semua Status', value: 'all' },
  { label: 'Menunggu', value: 'pending' },
  { label: 'Disetujui', value: 'approved' },
  { label: 'Ditolak', value: 'rejected' },
] as const
