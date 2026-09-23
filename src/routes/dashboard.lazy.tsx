import { Outlet, createLazyFileRoute } from '@tanstack/react-router'

import { DashboardLayout } from '@/components/layout/dashboard-layout'

export const Route = createLazyFileRoute('/dashboard')({
  component: DashboardRouteLayout,
})

function DashboardRouteLayout() {
  return (
    <DashboardLayout>
      <Outlet />
    </DashboardLayout>
  )
}
