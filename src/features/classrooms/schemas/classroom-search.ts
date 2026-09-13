import { createDataTableSearchSchema } from '@/components/data-table'
import { classroomFilterSchema } from '@/features/classrooms/lib/classroom-table'

export const classroomSearch = createDataTableSearchSchema({
  filterSchema: classroomFilterSchema,
})
