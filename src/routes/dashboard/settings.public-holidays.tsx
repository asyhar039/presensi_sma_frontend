import { createFileRoute } from '@tanstack/react-router'

import { ForbiddenInline } from '@/components/composite/forbidden'
import { PublicHolidayView } from '@/features/settings/views/public-holiday-view'

export const Route = createFileRoute('/dashboard/settings/public-holidays')({
  component: () => {
    const { auth } = Route.useRouteContext()
    if (!auth?.role?.isAdmin) {
      return <ForbiddenInline />
    }

    return <PublicHolidayView />
  },
})
