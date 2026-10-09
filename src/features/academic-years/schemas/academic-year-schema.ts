import * as v from 'valibot'

const dateField = (label: string) =>
  v.pipe(
    v.string(`${label} must be a string.`),
    v.nonEmpty(`Please pick ${label.toLowerCase()}.`),
  )

export const academicYearSchema = v.pipe(
  v.object({
    odd_start_date: dateField('Odd start date'),
    odd_end_date: dateField('Odd end date'),
    even_start_date: dateField('Even start date'),
    even_end_date: dateField('Even end date'),
    is_active: v.boolean(),
  }),
  v.forward(
    v.partialCheck(
      [['odd_start_date'], ['odd_end_date']],
      (input) =>
        new Date(input.odd_end_date).getTime() >=
        new Date(input.odd_start_date).getTime(),
      'Odd end date must be the same as or after the odd start date.',
    ),
    ['odd_end_date'],
  ),
  v.forward(
    v.partialCheck(
      [['even_start_date'], ['even_end_date']],
      (input) =>
        new Date(input.even_end_date).getTime() >=
        new Date(input.even_start_date).getTime(),
      'Even end date must be the same as or after the even start date.',
    ),
    ['even_end_date'],
  ),
)
// ponytail: skipped odd-end <= even-start ordering, add when backend validates it.
export type IAcademicYearSchema = v.InferOutput<typeof academicYearSchema>
