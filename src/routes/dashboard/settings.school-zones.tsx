import { createFileRoute } from '@tanstack/react-router'

import { ForbiddenInline } from '@/components/composite/forbidden'
import { SchoolZoneView } from '@/features/settings/views/school-zone-view'

export const Route = createFileRoute('/dashboard/settings/school-zones')({
  component: () => {
    const { auth } = Route.useRouteContext()
    if (!auth?.role?.isAdmin) {
      return <ForbiddenInline />
    }

    return <SchoolZoneView />
  },
})
