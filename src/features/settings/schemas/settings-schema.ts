import * as v from 'valibot'

import { WEEK_DAYS } from '@/features/settings/types/settings.types'

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

export const publicHolidaySchema = v.object({
  name: v.pipe(
    v.string('Name must be a string.'),
    v.trim(),
    v.nonEmpty('Please enter a holiday name.'),
    v.maxLength(120, 'Name must be at most 120 characters.'),
  ),
  date: v.pipe(
    v.string('Date must be a string.'),
    v.nonEmpty('Please pick a date.'),
    v.regex(/^\d{4}-\d{2}-\d{2}$/, 'Use YYYY-MM-DD format.'),
  ),
})

export type IPublicHolidaySchema = v.InferOutput<typeof publicHolidaySchema>

const latitudeSchema = v.pipe(
  v.number('Latitude must be a number.'),
  v.minValue(-90, 'Latitude must be between -90 and 90.'),
  v.maxValue(90, 'Latitude must be between -90 and 90.'),
)

const longitudeSchema = v.pipe(
  v.number('Longitude must be a number.'),
  v.minValue(-180, 'Longitude must be between -180 and 180.'),
  v.maxValue(180, 'Longitude must be between -180 and 180.'),
)

export const schoolZoneSchema = v.object({
  name: v.pipe(
    v.string('Name must be a string.'),
    v.trim(),
    v.nonEmpty('Please enter a zone name.'),
    v.maxLength(120, 'Name must be at most 120 characters.'),
  ),
  points: v.pipe(
    v.array(v.tuple([latitudeSchema, longitudeSchema])),
    v.minLength(3, 'Draw at least 3 points to form a school zone.'),
  ),
})
