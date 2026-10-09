import { createFileRoute } from '@tanstack/react-router'

import { StudentAttendanceHistoryView } from '@/features/student-permits/views/student-attendance-history-view'
import { mustBeLoggedIn } from '@/utils/router'

export const Route = createFileRoute('/dashboard/student/attendance-history')({
  beforeLoad: async ({ context, location }) => {
    await mustBeLoggedIn(context, location)
  },
  component: StudentAttendanceHistoryView,
})
