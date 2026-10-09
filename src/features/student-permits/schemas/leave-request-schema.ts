import * as v from 'valibot'

const notesField = v.pipe(
  v.string(),
  v.maxLength(255, 'Maximum 255 characters.'),
)

export const sickLeaveSchema = v.object({
  start_date: v.pipe(v.string(), v.nonEmpty('Start date is required.')),
  end_date: v.pipe(v.string(), v.nonEmpty('End date is required.')),
  notes: v.optional(notesField),
})

export const earlyOutSchema = v.object({
  time_out: v.pipe(v.string(), v.nonEmpty('Leave time is required.')),
  time_in: v.pipe(v.string(), v.nonEmpty('Return time is required.')),
  exit_reason: v.pipe(
    v.string(),
    v.nonEmpty('Reason is required.'),
    v.maxLength(255, 'Maximum 255 characters.'),
  ),
  destination: v.pipe(
    v.string(),
    v.nonEmpty('Destination is required.'),
    v.maxLength(128, 'Maximum 128 characters.'),
  ),
  contact_person: v.optional(
    v.pipe(v.string(), v.maxLength(64, 'Maximum 64 characters.')),
  ),
  notes: v.optional(notesField),
})

export const lateArrivalSchema = v.object({
  estimated_arrival_time: v.pipe(
    v.string(),
    v.nonEmpty('Estimated arrival time is required.'),
  ),
  late_reason: v.pipe(
    v.string(),
    v.nonEmpty('Reason is required.'),
    v.maxLength(255, 'Maximum 255 characters.'),
  ),
  notes: v.optional(notesField),
})

export type SickLeaveValues = v.InferOutput<typeof sickLeaveSchema>
export type EarlyOutValues = v.InferOutput<typeof earlyOutSchema>
export type LateArrivalValues = v.InferOutput<typeof lateArrivalSchema>
