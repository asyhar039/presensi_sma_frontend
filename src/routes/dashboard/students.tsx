import { createFileRoute } from '@tanstack/react-router'

import { ForbiddenInline } from '@/components/composite/forbidden'
import { studentSearch } from '@/features/students/schemas/student-search'
import { StudentView } from '@/features/students/views/student-view'
import { mustBeLoggedIn } from '@/utils/router'

export const Route = createFileRoute('/dashboard/students')({
  beforeLoad: async ({ context, location }) => {
    await mustBeLoggedIn(context, location)
  },
  validateSearch: studentSearch,
  component: () => {
    const { auth } = Route.useRouteContext()
    if (!auth?.role?.isAdmin) {
      return <ForbiddenInline />
    }

    return <StudentView />
  },
})
