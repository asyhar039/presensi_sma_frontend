import { createFileRoute } from '@tanstack/react-router'

import { ForbiddenInline } from '@/components/composite/forbidden'
import { subjectSearch } from '@/features/subjects/schemas/subject-search'
import { SubjectView } from '@/features/subjects/views/subject-view'
import { mustBeLoggedIn } from '@/utils/router'

export const Route = createFileRoute('/dashboard/subjects')({
  beforeLoad: async ({ context, location }) => {
    await mustBeLoggedIn(context, location)
  },
  validateSearch: subjectSearch,
  component: () => {
    const { auth } = Route.useRouteContext()
    if (!auth?.role?.isAdmin) {
      return <ForbiddenInline />
    }

    return <SubjectView />
  },
})
