import type { IRouterContext } from '@/types/router.types'

import { type ParsedLocation, redirect } from '@tanstack/react-router'
import { toast } from 'sonner'

export async function mustBeLoggedIn(
  { auth }: IRouterContext,
  location?: ParsedLocation,
) {
  if (!auth.user) {
    throw redirect({
      to: '/login',
      replace: true,
      search: {
        error_code: 'MUST_BE_LOGGED_IN',
      },
      state: {
        redirectTo: location?.href,
      },
    })
  }
}

export async function hasBeenLoggedIn({ auth }: IRouterContext) {
  if (auth.user) {
    toast.error('You are already logged in.')
    throw redirect({
      to: '/dashboard',
      replace: true,
    })
  }
}
