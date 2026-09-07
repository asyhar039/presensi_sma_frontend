import { useQuery } from '@tanstack/react-query'

import { authMeQueryOptions } from '@/features/auth/lib/auth-query-options'

export function useAuthMe(enabled: boolean) {
  return useQuery({ ...authMeQueryOptions, enabled })
}
