import { createFileRoute } from '@tanstack/react-router'

import { ForbiddenInline } from '@/components/composite/forbidden'
import { teacherSearch } from '@/features/teachers/schemas/teacher-search'
import { TeacherView } from '@/features/teachers/views/teacher-view'
import { mustBeLoggedIn } from '@/utils/router'

export const Route = createFileRoute('/dashboard/teachers')({
  beforeLoad: async ({ context, location }) => {
    await mustBeLoggedIn(context, location)
  },
  validateSearch: teacherSearch,
  component: () => {
    const { auth } = Route.useRouteContext()
    if (!auth?.role?.isAdmin) {
      return <ForbiddenInline />
    }

    return <TeacherView />
  },
})
