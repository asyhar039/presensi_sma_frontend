import type { ILoginSchema } from '@/features/auth/schemas/login-schema'
import type { IAuthLoginResponse } from '@/features/auth/types/auth-service'
import type { IAuthUser } from '@/types/auth.types'

import { api } from '@/services/api-client'

export function getMe() {
  return api.get<IAuthUser>('/auth/me')
}

export function postLogin(payload: ILoginSchema) {
  return api.post<IAuthLoginResponse>('/auth/login', payload)
}

export function postLogout() {
  return api.post('/auth/logout')
}
