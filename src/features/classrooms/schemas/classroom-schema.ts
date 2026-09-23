import * as v from 'valibot'

export const classroomSchema = v.object({
  name: v.pipe(
    v.string('Classroom name must be a string.'),
    v.trim(),
    v.nonEmpty('Please enter a classroom name.'),
    v.maxLength(64, 'Classroom name must be at most 64 characters.'),
  ),
  academic_year_id: v.pipe(
    v.string('Please select an academic year.'),
    v.nonEmpty('Please select an academic year.'),
  ),
  homeroom_teacher_id: v.string(),
})

export type IClassroomSchema = v.InferOutput<typeof classroomSchema>
