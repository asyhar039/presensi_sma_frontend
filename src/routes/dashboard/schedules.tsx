import { createFileRoute } from '@tanstack/react-router'

import { ForbiddenInline } from '@/components/composite/forbidden'
import { ScheduleView } from '@/features/schedules/views/schedule-view'
import { TeacherScheduleView } from '@/features/schedules/views/teacher-schedule-view'
import { mustBeLoggedIn } from '@/utils/router'

export const Route = createFileRoute('/dashboard/schedules')({
  beforeLoad: async ({ context, location }) => {
    await mustBeLoggedIn(context, location)
  },
  component: () => {
    const { auth } = Route.useRouteContext()
    if (!auth?.role?.isAdmin && !auth?.role?.isTeacher) {
      return <ForbiddenInline />
    }
    if (auth?.role?.isTeacher) return <TeacherScheduleView />
    return <ScheduleView />
  },
})
