import { queryOptions } from '@tanstack/react-query'

import { getMe } from '@/features/auth/services/auth-api'

export const authKeys = {
  me: ['auth', 'me'] as const,
}

export const authMeQueryOptions = queryOptions({
  queryKey: authKeys.me,
  queryFn: getMe,
  staleTime: 60_000,
  retry: false,
})
