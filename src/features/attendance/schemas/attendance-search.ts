import * as v from 'valibot'

import { attendanceFilterSchema } from '@/features/attendance/lib/attendance-table'

const searchNumber = v.optional(
  v.pipe(
    v.union([v.number(), v.string()]),
    v.transform((value) => Number(value)),
  ),
)

export const attendanceSearchSchema = v.looseObject({
  page: searchNumber,
  per_page: searchNumber,
  search: v.optional(v.string()),
  sortBy: v.optional(v.string()),
  order: v.optional(v.string()),
  ...attendanceFilterSchema.entries,
})

export const attendanceSearch = attendanceSearchSchema

export type AttendanceSearch = v.InferOutput<typeof attendanceSearchSchema>
