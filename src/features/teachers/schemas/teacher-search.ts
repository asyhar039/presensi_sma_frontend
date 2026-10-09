import { createDataTableSearchSchema } from '@/components/data-table'
import { teacherFilterSchema } from '@/features/teachers/lib/teacher-table'

export const teacherSearch = createDataTableSearchSchema({
  filterSchema: teacherFilterSchema,
})
