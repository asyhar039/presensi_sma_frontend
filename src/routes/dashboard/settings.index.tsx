import { createFileRoute } from '@tanstack/react-router'

import { ForbiddenInline } from '@/components/composite/forbidden'
import { ScheduleClockView } from '@/features/settings/views/schedule-clock-view'

export const Route = createFileRoute('/dashboard/settings/')({
  component: () => {
    const { auth } = Route.useRouteContext()
    if (!auth?.role?.isAdmin) {
      return <ForbiddenInline />
    }

    return <ScheduleClockView />
  },
})
