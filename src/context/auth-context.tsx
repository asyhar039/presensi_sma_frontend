import type { IAuthContext } from '@/types/auth.types'

import { useQueryClient } from '@tanstack/react-query'
import { createContext, use, useMemo, useState } from 'react'

import { LoadingScreen } from '@/components/composite/loading-screen'
import { useAuthMe } from '@/features/auth/hooks/use-auth-me'
import { useLogout } from '@/features/auth/hooks/use-logout'
import { authKeys } from '@/features/auth/lib/auth-query-options'
import {
  clearAccessToken,
  hasAccessToken,
} from '@/features/auth/services/auth-storage'
import { parseRole } from '@/utils/role'

const AuthContext = createContext<IAuthContext | null>(null)

export function AuthProvider({ children }: React.PropsWithChildren) {
  const queryClient = useQueryClient()
  const [hasToken, setHasToken] = useState(() => hasAccessToken())

  const meQuery = useAuthMe(hasToken)
  const logout = useLogout()

  const userData = meQuery.data
  const queryRefetch = meQuery.refetch

  const value = useMemo<IAuthContext>((): IAuthContext => {
    return {
      user: userData || null,
      role: parseRole(userData?.roles),
      refetch: async () => {
        await queryRefetch()
      },
      login: async (data) => {
        queryClient.setQueryData(authKeys.me, data)
        setHasToken(true)
      },
      logout: async () => {
        try {
          await logout.mutateAsync()
        } finally {
          queryClient.setQueryData(authKeys.me, null)
          clearAccessToken()
          setHasToken(false)
        }
      },
    }
  }, [userData, queryRefetch, queryClient, logout])

  if (meQuery.isLoading && hasToken) {
    return (
      <LoadingScreen type="background" message="Checking authentication..." />
    )
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): IAuthContext {
  const ctx = use(AuthContext)
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider')
  }

  return ctx
}
