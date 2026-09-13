import { createDataTableSearchSchema } from '@/components/data-table'
import { academicYearFilterSchema } from '@/features/academic-years/lib/academic-year-table'

export const academicYearSearch = createDataTableSearchSchema({
  filterSchema: academicYearFilterSchema,
})
