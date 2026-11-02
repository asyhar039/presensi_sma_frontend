import { createFileRoute } from '@tanstack/react-router'

import { LandingPageView } from '@/features/landing/views/landing-page-view'

export const Route = createFileRoute('/')({
  component: LandingPageView,
})
