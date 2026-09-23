import * as v from 'valibot'

import { WEEK_DAYS } from '@/features/settings/types/schedule-clock.types'

export const timeStringSchema = v.pipe(
  v.string('Time must be a string.'),
  v.regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'Use 24-hour HH:MM format.'),
)

export const scheduleSlotSchema = v.pipe(
  v.object({
    start: timeStringSchema,
    end: timeStringSchema,
    is_break: v.optional(v.boolean(), false),
  }),
  v.forward(
    v.partialCheck(
      [['start'], ['end']],
      (input) => input.start < input.end,
      'End time must be after start time.',
    ),
    ['end'],
  ),
)

export const dayScheduleSchema = v.object({
  day: v.picklist(WEEK_DAYS, 'Please select a day.'),
  schedules: v.array(scheduleSlotSchema),
})
