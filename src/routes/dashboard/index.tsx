import { createFileRoute } from '@tanstack/react-router'

import { ForbiddenInline } from '@/components/composite/forbidden'
import { AdminDashboardView } from '@/features/admin/views/admin-dashboard-view'
import { StudentDashboardView } from '@/features/student-permits/views/student-dashboard-view'
import { TeacherDashboardView } from '@/features/teacher-session/views/teacher-dashboard-view'
import { mustBeLoggedIn } from '@/utils/router'

export const Route = createFileRoute('/dashboard/')({
  beforeLoad: async ({ context, location }) => {
    await mustBeLoggedIn(context, location)
  },
  component: () => {
    const { auth } = Route.useRouteContext()

    if (auth?.role?.isStudent) {
      return <StudentDashboardView />
    }

    if (auth?.role?.isAdmin) {
      return <AdminDashboardView />
    }

    if (auth?.role?.isTeacher) {
      return <TeacherDashboardView />
    }

    return <ForbiddenInline />
  },
})
