import type { IAuthUser } from '@/types/auth.types'

export type IAuthLoginResponse = {
  token: string
  token_type: string
  user: IAuthUser
}
