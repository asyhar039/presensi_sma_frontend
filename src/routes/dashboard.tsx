import { createFileRoute } from '@tanstack/react-router'

import { mustBeLoggedIn } from '@/utils/router'

export const Route = createFileRoute('/dashboard')({
  beforeLoad: async ({ context, location }) => {
    await mustBeLoggedIn(context, location)
  },
})
