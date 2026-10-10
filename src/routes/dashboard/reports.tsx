import { createFileRoute } from '@tanstack/react-router'

import { ReportView } from '@/features/reports/views/report-view'
import { mustBeLoggedIn } from '@/utils/router'

export const Route = createFileRoute('/dashboard/reports')({
  beforeLoad: async ({ context, location }) => {
    await mustBeLoggedIn(context, location)
  },
  component: ReportView,
})
