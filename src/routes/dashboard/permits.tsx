import { createFileRoute } from '@tanstack/react-router'

import { ForbiddenInline } from '@/components/composite/forbidden'
import { permitSearchSchema } from '@/features/permits/schemas/permit-search'
import { TeacherPermitView } from '@/features/permits/views/teacher-permit-view'
import { mustBeLoggedIn } from '@/utils/router'

export const Route = createFileRoute('/dashboard/permits')({
  beforeLoad: async ({ context, location }) => {
    await mustBeLoggedIn(context, location)
  },
  validateSearch: permitSearchSchema,
  component: () => {
    const { auth } = Route.useRouteContext()
    if (!auth?.role?.isTeacher && !auth?.role?.isAdmin) {
      return <ForbiddenInline />
    }
    return <TeacherPermitView />
  },
})
