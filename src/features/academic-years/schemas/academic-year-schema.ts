import * as v from 'valibot'

export const academicYearSemesterSchema = v.picklist(
  ['odd', 'even'],
  'Please select a semester.',
)

export const academicYearSchema = v.pipe(
  v.object({
    start_date: v.pipe(
      v.string('Start date must be a string.'),
      v.nonEmpty('Please pick a start date.'),
    ),
    end_date: v.pipe(
      v.string('End date must be a string.'),
      v.nonEmpty('Please pick an end date.'),
    ),
    semester: academicYearSemesterSchema,
    is_active: v.boolean(),
  }),
  v.forward(
    v.partialCheck(
      [['start_date'], ['end_date']],
      (input) =>
        new Date(input.end_date).getTime() >=
        new Date(input.start_date).getTime(),
      'End date must be the same as or after the start date.',
    ),
    ['end_date'],
  ),
)

export type IAcademicYearSchema = v.InferOutput<typeof academicYearSchema>
