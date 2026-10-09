import { createDataTableSearchSchema } from '@/components/data-table'
import { studentFilterSchema } from '@/features/students/lib/student-table'

export const studentSearch = createDataTableSearchSchema({
  filterSchema: studentFilterSchema,
})
