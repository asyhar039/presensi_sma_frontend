import type { IAuthContext } from '@/types/auth.types'

import { useQueryClient } from '@tanstack/react-query'
import { createContext, use, useMemo } from 'react'

import { LoadingScreen } from '@/components/composite/loading-screen'
import { useAuthMe } from '@/features/auth/hooks/use-auth-me'
import { useLogout } from '@/features/auth/hooks/use-logout'
import { authKeys } from '@/features/auth/lib/auth-query-options'
import {
  clearAccessToken,
  hasAccessToken,
} from '@/features/auth/services/auth-storage'

const AuthContext = createContext<IAuthContext | null>(null)

export function AuthProvider({ children }: React.PropsWithChildren) {
  const queryClient = useQueryClient()
  const hasToken = hasAccessToken()
  const meQuery = useAuthMe(hasToken)
  const logout = useLogout()

  const userData = meQuery.data
  const queryRefetch = meQuery.refetch

  const value = useMemo<IAuthContext>((): IAuthContext => {
    return {
      user: userData || null,
      refetch: async () => {
        await queryRefetch()
      },
      logout: async () => {
        try {
          await logout.mutateAsync()
        } finally {
          await queryClient.setQueryData(authKeys.me, null)
          clearAccessToken()
        }
      },
    }
  }, [userData, queryRefetch, queryClient, logout])

  if (meQuery.isLoading && hasToken) {
    return (
      <LoadingScreen type="background" message="Checking authentication..." />
    )
  }

  return <AuthContext value={value}>{children}</AuthContext>
}

export function useAuth(): IAuthContext {
  const ctx = use(AuthContext)
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider')
  }

  return ctx
}
