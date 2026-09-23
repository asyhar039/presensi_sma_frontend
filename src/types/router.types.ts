import type { QueryClient } from '@tanstack/react-query'
import type { IAuthContext } from '@/types/auth.types'

export interface IRouterContext {
  auth: IAuthContext
  queryClient: QueryClient
}
