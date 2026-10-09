import * as v from 'valibot'

export const ATTENDANCE_SORT_BY = [
  'date',
  'student_name',
  'subject_name',
  'status',
] as const

export const ATTENDANCE_SUMMARY_SORT_BY = [
  'student_id',
  'student_name',
  'present',
  'permission',
  'sick',
  'absent',
  'attendance_rate',
] as const

export const ATTENDANCE_DEFAULT_SORT_BY = 'date'
export const ATTENDANCE_SUMMARY_DEFAULT_SORT_BY = 'student_name'
export const ATTENDANCE_DEFAULT_ORDER = 'desc' as const
export const ATTENDANCE_PER_PAGE_OPTIONS = [10, 20, 30, 50]

export const attendanceFilterSchema = v.object({
  classroom_id: v.optional(v.string()),
  month: v.optional(v.string()),
  semester: v.optional(v.string()),
  status: v.optional(
    v.picklist(['all', 'present', 'permission', 'sick', 'absent']),
  ),
})

export type AttendanceFilters = v.InferOutput<typeof attendanceFilterSchema>

export const ATTENDANCE_DEFAULT_FILTERS: AttendanceFilters = {
  classroom_id: '',
  month: '',
  semester: '',
  status: 'all',
}

export const ATTENDANCE_STATUS_OPTIONS = [
  { label: 'Semua Status', value: 'all' },
  { label: 'Hadir', value: 'present' },
  { label: 'Izin', value: 'permission' },
  { label: 'Sakit', value: 'sick' },
  { label: 'Alpa', value: 'absent' },
]
