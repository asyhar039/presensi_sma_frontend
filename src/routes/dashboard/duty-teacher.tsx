import { createFileRoute } from '@tanstack/react-router'

import { ForbiddenInline } from '@/components/composite/forbidden'
import { dutyAssignmentSearch } from '@/features/duty-teacher/assignments/schema'
import { DutyAssignmentView } from '@/features/duty-teacher/assignments/view'
import { DutyTeacherView } from '@/features/duty-teacher/views/duty-teacher-view'
import { mustBeLoggedIn } from '@/utils/router'

export const Route = createFileRoute('/dashboard/duty-teacher')({
  validateSearch: dutyAssignmentSearch,
  beforeLoad: async ({ context, location }) => {
    await mustBeLoggedIn(context, location)
  },
  component: () => {
    const { auth } = Route.useRouteContext()

    if (auth?.role?.isAdmin) {
      return <DutyAssignmentView />
    }

    if (auth?.role?.isTeacher) {
      return <DutyTeacherView />
    }

    return <ForbiddenInline />
  },
})
