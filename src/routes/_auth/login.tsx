import { createFileRoute } from '@tanstack/react-router'

import { loginSearch } from '@/features/auth/schemas/login-schema'
import { hasBeenLoggedIn } from '@/utils/router'

export const Route = createFileRoute('/_auth/login')({
  beforeLoad: async ({ context }) => {
    await hasBeenLoggedIn(context)
  },
  validateSearch: loginSearch,
})
