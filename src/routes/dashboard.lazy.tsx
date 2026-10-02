import {
  Outlet,
  createLazyFileRoute,
  useLocation,
} from '@tanstack/react-router'

import { ForbiddenInline } from '@/components/composite/forbidden'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { AdminDashboardView } from '@/features/admin/views/admin-dashboard-view'
import { StudentDashboardView } from '@/features/student-permits/views/student-dashboard-view'
import { TeacherAttendanceView } from '@/features/teacher-attendance/views/teacher-attendance-view'

export const Route = createLazyFileRoute('/dashboard')({
  component: DashboardRouteLayout,
})

type RootDashboardContentProps = {
  auth: {
    role?: {
      isStudent?: boolean
      isAdmin?: boolean
      isTeacher?: boolean
    } | null
  } | null
}

function DashboardRouteLayout() {
  const { auth } = Route.useRouteContext()
  const location = useLocation()

  // Check if we're at the dashboard root (no child route)
  const isDashboardRoot =
    location.pathname === '/dashboard' || location.pathname === '/dashboard/'

  return (
    <DashboardLayout>
      {isDashboardRoot ? <RootDashboardContent auth={auth} /> : <Outlet />}
    </DashboardLayout>
  )
}

function RootDashboardContent({ auth }: RootDashboardContentProps) {
  if (auth?.role?.isStudent) {
    return <StudentDashboardView />
  }

  if (auth?.role?.isAdmin) {
    return <AdminDashboardView />
  }

  if (auth?.role?.isTeacher) {
    return <TeacherAttendanceView classroomId={1} classroomName="XII IPA 1" />
  }

  return <ForbiddenInline />
}
