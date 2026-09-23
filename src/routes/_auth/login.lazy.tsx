import { createLazyFileRoute } from '@tanstack/react-router'

import { LoginView } from '@/features/auth/views/login-view'

export const Route = createLazyFileRoute('/_auth/login')({
  component: LoginView,
})
