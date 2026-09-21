import { createDataTableSearchSchema } from '@/components/data-table'
import { attendanceFilterSchema } from '@/features/attendance/lib/attendance-table'

export const attendanceSearch = createDataTableSearchSchema({
  filterSchema: attendanceFilterSchema,
})
