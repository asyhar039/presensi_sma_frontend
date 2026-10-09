import * as v from 'valibot'

export const subjectSchema = v.object({
  name: v.pipe(
    v.string('Subject name must be a string.'),
    v.trim(),
    v.nonEmpty('Please enter a subject name.'),
    v.maxLength(64, 'Subject name must be at most 64 characters.'),
  ),
})

export type ISubjectSchema = v.InferOutput<typeof subjectSchema>
