import * as v from 'valibot'

export const attendanceSessionSchema = v.object({
  subject: v.pipe(
    v.string('Subject is required.'),
    v.nonEmpty('Subject is required.'),
    v.maxLength(255, 'Subject must be 255 characters or less.'),
  ),
  class_name: v.pipe(
    v.string('Class is required.'),
    v.nonEmpty('Class is required.'),
  ),
  room: v.pipe(v.string('Room is required.'), v.nonEmpty('Room is required.')),
  start_time: v.string('Start time is required.'),
  end_time: v.string('End time is required.'),
})
export type IAttendanceSessionSchema = v.InferOutput<
  typeof attendanceSessionSchema
>

export const attendanceRequestSchema = v.object({
  reason: v.pipe(
    v.string('Reason is required.'),
    v.nonEmpty('Reason is required.'),
  ),
  purpose: v.pipe(
    v.string('Purpose is required.'),
    v.nonEmpty('Purpose is required.'),
  ),
  pick_up_person: v.optional(v.string()),
  supervising_teacher: v.optional(v.string()),
  attachment: v.optional(v.string()),
})
export type IAttendanceRequestSchema = v.InferOutput<
  typeof attendanceRequestSchema
>
