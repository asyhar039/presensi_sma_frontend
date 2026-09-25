import * as v from 'valibot'

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
