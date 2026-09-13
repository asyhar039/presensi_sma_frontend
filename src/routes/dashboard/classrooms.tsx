import { createFileRoute } from '@tanstack/react-router'

import { ForbiddenInline } from '@/components/composite/forbidden'
import { classroomSearch } from '@/features/classrooms/schemas/classroom-search'
import { ClassroomView } from '@/features/classrooms/views/classroom-view'
import { mustBeLoggedIn } from '@/utils/router'

export const Route = createFileRoute('/dashboard/classrooms')({
  beforeLoad: async ({ context, location }) => {
    await mustBeLoggedIn(context, location)
  },
  validateSearch: classroomSearch,
  component: () => {
    const { auth } = Route.useRouteContext()
    if (!auth?.role?.isAdmin) {
      return <ForbiddenInline />
    }

    return <ClassroomView />
  },
})
