import * as v from 'valibot'

export const permitApplicationSchema = v.object({
  type: v.picklist(['sick', 'leave_school', 'leave_in']),
  start_date: v.string(),
  end_date: v.string(),
  reason: v.string(),
})

export type PermitApplication = v.InferOutput<typeof permitApplicationSchema>
