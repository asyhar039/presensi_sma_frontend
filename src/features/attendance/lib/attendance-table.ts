import * as v from 'valibot'

export const ATTENDANCE_SORT_BY = [
  'id',
  'session_date',
  'status',
  'created_at',
] as const

export const ATTENDANCE_DEFAULT_SORT_BY = 'created_at'
export const ATTENDANCE_DEFAULT_ORDER = 'desc' as const
export const ATTENDANCE_PER_PAGE_OPTIONS = [10, 20, 30, 50]

export const attendanceFilterSchema = v.object({
  status: v.picklist(['all', 'present', 'absent', 'late', 'permission']),
})

export type AttendanceFilters = v.InferOutput<typeof attendanceFilterSchema>

export const ATTENDANCE_DEFAULT_FILTERS: AttendanceFilters = {
  status: 'all',
}

export const ATTENDANCE_STATUS_OPTIONS = [
  { label: 'All statuses', value: 'all' },
  { label: 'Present', value: 'present' },
  { label: 'Absent', value: 'absent' },
  { label: 'Late', value: 'late' },
  { label: 'Permission', value: 'permission' },
]

export const ATTENDANCE_STATUS_FORM_OPTIONS = [
  { label: 'Present', value: 'present' },
  { label: 'Absent', value: 'absent' },
  { label: 'Late', value: 'late' },
  { label: 'Permission', value: 'permission' },
]
