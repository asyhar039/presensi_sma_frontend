import { createFileRoute } from '@tanstack/react-router'

import { ForbiddenInline } from '@/components/composite/forbidden'
import { DutyTeacherView } from '@/features/duty-teacher/views/duty-teacher-view'
import { mustBeLoggedIn } from '@/utils/router'

export const Route = createFileRoute('/dashboard/duty-teacher')({
  beforeLoad: async ({ context, location }) => {
    await mustBeLoggedIn(context, location)
  },
  component: () => {
    const { auth } = Route.useRouteContext()

    if (!auth?.role?.isTeacher && !auth?.role?.isAdmin) {
      return <ForbiddenInline />
    }

    return <DutyTeacherView />
  },
})
