import { createFileRoute } from '@tanstack/react-router'

import { ForbiddenInline } from '@/components/composite/forbidden'
import { attendanceSearch } from '@/features/attendance/schemas/attendance-search'
import { AttendanceRecapView } from '@/features/attendance/views/attendance-recap-view'
import { mustBeLoggedIn } from '@/utils/router'

export const Route = createFileRoute('/dashboard/attendance-recap/')({
  beforeLoad: async ({ context, location }) => {
    await mustBeLoggedIn(context, location)
  },
  validateSearch: attendanceSearch,
  component: () => {
    const { auth } = Route.useRouteContext()
    if (!auth?.role?.isAdmin && !auth?.role?.isTeacher) {
      return <ForbiddenInline />
    }

    return <AttendanceRecapView />
  },
})
