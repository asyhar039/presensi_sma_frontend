import * as v from 'valibot'

import { createDataTableSearchSchema } from '@/components/data-table'

export const DUTY_DAYS = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
] as const

export type DutyDay = (typeof DUTY_DAYS)[number]

export const DUTY_DAY_OPTIONS = DUTY_DAYS.map((day) => ({
  label: day.charAt(0).toUpperCase() + day.slice(1),
  value: day,
}))

const timeField = v.pipe(
  v.string('Please select a time.'),
  v.nonEmpty('Please select a time.'),
  v.regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'Use 24-hour HH:MM format.'),
)

export const dutyAssignmentSchema = v.pipe(
  v.object({
    academic_year_id: v.pipe(
      v.string('Please select an academic year.'),
      v.nonEmpty('Please select an academic year.'),
    ),
    teacher_id: v.pipe(
      v.string('Please select a teacher.'),
      v.nonEmpty('Please select a teacher.'),
    ),
    day: v.picklist(DUTY_DAYS, 'Please select a day.'),
    start_time: timeField,
    end_time: timeField,
  }),
  v.check(
    (input) => input.end_time > input.start_time,
    'End time must be after start time.',
  ),
)

export type IDutyAssignmentSchema = v.InferOutput<typeof dutyAssignmentSchema>

export const DUTY_ASSIGNMENT_SORT_BY = [
  'id',
  'day',
  'start_time',
  'created_at',
] as const
export const DUTY_ASSIGNMENT_DEFAULT_SORT_BY = 'created_at'
export const DUTY_ASSIGNMENT_DEFAULT_ORDER = 'desc' as const
export const DUTY_ASSIGNMENT_PER_PAGE_OPTIONS = [10, 20, 30, 50]

export const dutyAssignmentFilterSchema = v.object({
  academic_year_id: v.optional(v.string(), ''),
  teacher_id: v.optional(v.string(), ''),
  day: v.optional(v.string(), ''),
})

export type DutyAssignmentFilters = v.InferOutput<
  typeof dutyAssignmentFilterSchema
>

export const DUTY_ASSIGNMENT_DEFAULT_FILTERS: DutyAssignmentFilters = {
  academic_year_id: '',
  teacher_id: '',
  day: '',
}

export const dutyAssignmentSearch = createDataTableSearchSchema({
  filterSchema: dutyAssignmentFilterSchema,
})
