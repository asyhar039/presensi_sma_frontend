import * as v from 'valibot'

import { WEEK_DAYS } from '@/features/settings/types/schedule-clock.types'

const timeField = v.pipe(
  v.string('Use HH:MM format.'),
  v.regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'Use 24-hour HH:MM format.'),
)

export const classScheduleSchema = v.pipe(
  v.object({
    teacher_id: v.pipe(
      v.string('Please select a teacher.'),
      v.nonEmpty('Please select a teacher.'),
    ),
    day: v.picklist(WEEK_DAYS, 'Please select a day.'),
    period: v.pipe(
      v.number('Period must be a number.'),
      v.integer('Period must be an integer.'),
      v.minValue(0, 'Period must be at least 0.'),
      v.maxValue(30, 'Period must be at most 30.'),
    ),
    start_time: timeField,
    end_time: timeField,
  }),
  v.forward(
    v.partialCheck(
      [['start_time'], ['end_time']],
      (input) => input.start_time < input.end_time,
      'End time must be after start time.',
    ),
    ['end_time'],
  ),
)

export type IClassScheduleSchema = v.InferOutput<typeof classScheduleSchema>
