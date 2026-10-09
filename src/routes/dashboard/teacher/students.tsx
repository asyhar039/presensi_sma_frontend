import { createFileRoute } from '@tanstack/react-router'

import { ForbiddenInline } from '@/components/composite/forbidden'
import { studentSearch } from '@/features/students/schemas/student-search'
import { TeacherStudentView } from '@/features/students/views/teacher-student-view'
import { mustBeLoggedIn } from '@/utils/router'

export const Route = createFileRoute('/dashboard/teacher/students')({
  beforeLoad: async ({ context, location }) => {
    await mustBeLoggedIn(context, location)
  },
  validateSearch: studentSearch,
  component: () => {
    const { auth } = Route.useRouteContext()
    if (!auth?.role?.isTeacher) {
      return <ForbiddenInline />
    }

    return <TeacherStudentView />
  },
})
