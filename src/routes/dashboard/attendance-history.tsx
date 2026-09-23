import { createFileRoute } from '@tanstack/react-router'

import { ForbiddenInline } from '@/components/composite/forbidden'
import { AttendanceHistoryView } from '@/features/attendance/views/attendance-history-view'
import { mustBeLoggedIn } from '@/utils/router'

export const Route = createFileRoute('/dashboard/attendance-history')({
  beforeLoad: async ({ context, location }) => {
    await mustBeLoggedIn(context, location)
  },
  component: () => {
    const { auth } = Route.useRouteContext()
    if (!auth?.role?.isTeacher) {
      return <ForbiddenInline />
    }
    return <AttendanceHistoryView />
  },
})
