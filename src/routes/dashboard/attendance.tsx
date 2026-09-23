import { createFileRoute } from '@tanstack/react-router'

import { ForbiddenInline } from '@/components/composite/forbidden'
import { AttendanceView } from '@/features/attendance/views/attendance-view'
import { mustBeLoggedIn } from '@/utils/router'

export const Route = createFileRoute('/dashboard/attendance')({
  beforeLoad: async ({ context, location }) => {
    await mustBeLoggedIn(context, location)
  },
  component: () => {
    const { auth } = Route.useRouteContext()
    if (!auth?.role?.isTeacher) return <ForbiddenInline />
    return <AttendanceView />
  },
})
