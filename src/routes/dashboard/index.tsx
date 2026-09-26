import { createFileRoute } from '@tanstack/react-router'

import { ForbiddenInline } from '@/components/composite/forbidden'
import { Typography } from '@/components/ui/typography'
import { StudentDashboardView } from '@/features/student-permits/views/student-dashboard-view'
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

    if (auth?.role?.isTeacher || auth?.role?.isAdmin) {
      return (
        <div className="flex h-full min-h-svh w-full flex-col items-center justify-center gap-6 p-6">
          <Typography as="h1" variant="h1">
            Dashboard Page
          </Typography>
        </div>
      )
    }

    return <ForbiddenInline />
  },
})
